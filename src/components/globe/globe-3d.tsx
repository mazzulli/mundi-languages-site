"use client";

import { Line } from "@react-three/drei";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";

import dots from "@content/generated/globe-dots.json";
import { DEFAULT_VIEW, GLOBE_ROUTES, latLngToVector, rotationToFace, type GlobeCity } from "./geo";

type Globe3DProps = {
  cities: GlobeCity[];
  selected: string | null;
  onSelect: (city: string) => void;
  /** Pause rendering while the section is off-screen. */
  active: boolean;
  onReady?: () => void;
  /** DOM element (outside the canvas) that shows the hovered/selected city name. */
  labelRef: RefObject<HTMLSpanElement | null>;
};

const COLORS = {
  sphere: "#0f1a2b",
  land: "#a5c7c2",
  pin: "#fa8746",
  arc: "#a5c7c2",
};

/**
 * 3D globe of our students (spec §4.3): land dots, city pins (click → testimonial), animated
 * arcs. Drag to rotate; selecting a city spins it to the front. Loaded lazily, client-only.
 */
export default function Globe3D({
  cities,
  selected,
  onSelect,
  active,
  onReady,
  labelRef,
}: Globe3DProps) {
  return (
    <Canvas
      aria-hidden
      frameloop={active ? "always" : "never"}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 3.9], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      className="touch-pan-y"
      onCreated={() => onReady?.()}
    >
      <GlobeScene cities={cities} selected={selected} onSelect={onSelect} labelRef={labelRef} />
    </Canvas>
  );
}

function GlobeScene({
  cities,
  selected,
  onSelect,
  labelRef,
}: Omit<Globe3DProps, "active" | "onReady">) {
  const group = useRef<THREE.Group>(null);
  const drag = useRef({ active: false, x: 0, y: 0, idleUntil: 0 });
  const target = useRef(rotationToFace(DEFAULT_VIEW.lat, DEFAULT_VIEW.lng));
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered]);

  // Spin the selected city to the front.
  useEffect(() => {
    const city = cities.find((c) => c.name === selected);
    if (!city) return;
    const [x, y] = rotationToFace(city.lat, city.lng);
    // Pick the equivalent angle closest to the current one → no multi-turn spins.
    const currentY = group.current?.rotation.y ?? 0;
    const turns = Math.round((currentY - y) / (Math.PI * 2));
    target.current = [x, y + turns * Math.PI * 2];
    drag.current.idleUntil = performance.now() + 6000;
  }, [selected, cities]);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const now = performance.now();
    if (!drag.current.active && now > drag.current.idleUntil) {
      target.current[1] -= delta * 0.06; // slow auto-rotation when idle
    }
    const ease = 1 - Math.pow(0.001, delta); // frame-rate independent lerp
    g.rotation.x += (target.current[0] - g.rotation.x) * ease;
    g.rotation.y += (target.current[1] - g.rotation.y) * ease;
  });

  function onPointerDown(event: ThreeEvent<PointerEvent>) {
    drag.current = { ...drag.current, active: true, x: event.clientX, y: event.clientY };
    (event.target as Element | null)?.setPointerCapture?.(event.pointerId);
  }
  function onPointerMove(event: ThreeEvent<PointerEvent>) {
    if (!drag.current.active) return;
    const dx = event.clientX - drag.current.x;
    const dy = event.clientY - drag.current.y;
    drag.current.x = event.clientX;
    drag.current.y = event.clientY;
    target.current = [
      THREE.MathUtils.clamp(target.current[0] + dy * 0.005, -0.9, 0.9),
      target.current[1] + dx * 0.006,
    ];
  }
  function onPointerUp() {
    drag.current.active = false;
    drag.current.idleUntil = performance.now() + 4000;
  }

  return (
    <group
      ref={group}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <mesh>
        <sphereGeometry args={[0.995, 64, 64]} />
        <meshBasicMaterial color={COLORS.sphere} />
      </mesh>
      <Atmosphere />
      <LandDots />
      {GLOBE_ROUTES.map(([from, to], index) => {
        const a = cities.find((c) => c.name === from);
        const b = cities.find((c) => c.name === to);
        return a && b ? <Arc key={`${from}-${to}`} from={a} to={b} offset={index * 0.37} /> : null;
      })}
      {cities.map((city) => (
        <Pin
          key={city.name}
          city={city}
          selected={city.name === selected}
          hovered={city.name === hovered}
          onSelect={onSelect}
          onHover={setHovered}
        />
      ))}
      <CityLabel
        city={cities.find((c) => c.name === (hovered ?? selected)) ?? null}
        labelRef={labelRef}
      />
    </group>
  );
}

function LandDots() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const points = dots as [number, number][];

  useEffect(() => {
    const instanced = mesh.current;
    if (!instanced) return;
    const dummy = new THREE.Object3D();
    points.forEach(([lat, lng], i) => {
      const [x, y, z] = latLngToVector(lat, lng, 1.001);
      dummy.position.set(x, y, z);
      dummy.lookAt(x * 2, y * 2, z * 2);
      dummy.updateMatrix();
      instanced.setMatrixAt(i, dummy.matrix);
    });
    instanced.instanceMatrix.needsUpdate = true;
  }, [points]);

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, points.length]}>
      <circleGeometry args={[0.0085, 6]} />
      <meshBasicMaterial color={COLORS.land} transparent opacity={0.75} side={THREE.DoubleSide} />
    </instancedMesh>
  );
}

function Atmosphere() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: { color: { value: new THREE.Color(COLORS.land) } },
        vertexShader: /* glsl */ `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,
        fragmentShader: /* glsl */ `
          uniform vec3 color;
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
            gl_FragColor = vec4(color, clamp(intensity, 0.0, 1.0) * 0.9);
          }`,
      }),
    [],
  );
  return (
    <mesh scale={1.18} material={material}>
      <sphereGeometry args={[1, 48, 48]} />
    </mesh>
  );
}

function Arc({ from, to, offset }: { from: GlobeCity; to: GlobeCity; offset: number }) {
  const line = useRef<{ material: { dashOffset: number } } | null>(null);
  const points = useMemo(() => {
    const a = new THREE.Vector3(...latLngToVector(from.lat, from.lng, 1.005));
    const b = new THREE.Vector3(...latLngToVector(to.lat, to.lng, 1.005));
    const lift = 1 + a.distanceTo(b) * 0.35;
    const mid = a.clone().add(b).normalize().multiplyScalar(lift);
    return new THREE.QuadraticBezierCurve3(a, mid, b).getPoints(48);
  }, [from, to]);

  useFrame((_, delta) => {
    if (line.current) line.current.material.dashOffset -= delta * 0.35;
  });

  return (
    <Line
      // drei's Line2 exposes a dashed LineMaterial; we animate its dashOffset.
      ref={line as never}
      points={points}
      color={COLORS.arc}
      lineWidth={1.4}
      dashed
      dashSize={0.18}
      gapSize={0.12}
      dashOffset={offset}
      transparent
      opacity={0.85}
    />
  );
}

function Pin({
  city,
  selected,
  hovered,
  onSelect,
  onHover,
}: {
  city: GlobeCity;
  selected: boolean;
  hovered: boolean;
  onSelect: (city: string) => void;
  onHover: (city: string | null) => void;
}) {
  const ring = useRef<THREE.Mesh>(null);
  const position = useMemo(() => latLngToVector(city.lat, city.lng, 1.01), [city]);
  // Face outward from the globe centre, in the group's local space.
  const quaternion = useMemo(
    () =>
      new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(...position).normalize(),
      ),
    [position],
  );

  useFrame(({ clock }) => {
    const r = ring.current;
    if (!r) return;
    const t = (clock.elapsedTime * 0.7 + city.lat * 0.01) % 1;
    r.scale.setScalar(1 + t * 1.4);
    (r.material as THREE.MeshBasicMaterial).opacity = 0.7 * (1 - t);
  });

  const size = selected ? 0.026 : hovered ? 0.022 : 0.015;
  return (
    <group position={position} quaternion={quaternion}>
      <mesh
        onClick={(event) => {
          event.stopPropagation();
          onSelect(city.name);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          onHover(city.name);
        }}
        onPointerOut={() => onHover(null)}
      >
        <circleGeometry args={[0.07, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      <mesh position={[0, 0, 0.002]}>
        <circleGeometry args={[size, 24]} />
        <meshBasicMaterial color={selected ? "#ffffff" : COLORS.pin} />
      </mesh>
      <mesh ref={ring} position={[0, 0, 0.001]}>
        <ringGeometry args={[size * 1.1, size * 1.35, 32]} />
        <meshBasicMaterial color={COLORS.pin} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

/**
 * Name of the hovered (or selected) city. Instead of drei's <Html> (which creates a separate
 * React root per label and triggers "synchronously unmount a root" warnings), the city is
 * projected to screen space every frame and written to a plain DOM element. The label hides
 * when the city is on the far side of the globe.
 */
function CityLabel({
  city,
  labelRef,
}: {
  city: GlobeCity | null;
  labelRef: RefObject<HTMLSpanElement | null>;
}) {
  const anchor = useRef<THREE.Object3D>(null);
  const world = useMemo(() => new THREE.Vector3(), []);
  const position = useMemo(
    () =>
      city ? latLngToVector(city.lat, city.lng, 1.06) : ([0, 0, 0] as [number, number, number]),
    [city],
  );

  useFrame(({ camera, size }) => {
    const label = labelRef.current;
    const point = anchor.current;
    if (!label || !point) return;
    point.getWorldPosition(world);
    const facing = city && world.z > 0.15; // camera looks down -Z from +Z
    if (!facing) {
      label.style.opacity = "0";
      return;
    }
    world.project(camera);
    const x = ((world.x + 1) / 2) * size.width;
    const y = ((1 - world.y) / 2) * size.height;
    label.textContent = city.name;
    label.style.opacity = "1";
    label.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -140%)`;
  });

  return <object3D ref={anchor} position={position} />;
}
