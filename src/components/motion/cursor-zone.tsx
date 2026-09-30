"use client";

import { useRef, useState, type PointerEvent, type ReactNode } from "react";

import { cx } from "@/lib/utils";

const INTERACTIVE = "a, button, [role='button'], label, summary";
const ENABLED_QUERY =
  "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

type CursorState = { mode: "idle" | "link" | "label"; label?: string };

/**
 * Custom cursor limited to one section: a dot that follows the pointer and a trailing ring
 * that grows over links and turns into a label pill over `[data-cursor="Label"]`.
 * The native cursor is hidden only inside the zone; the rAF loop runs only while the
 * pointer is inside. Mouse only, never under `prefers-reduced-motion`.
 */
export function CursorZone({ children, className }: { children: ReactNode; className?: string }) {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const motion = useRef({ tx: 0, ty: 0, rx: 0, ry: 0, frame: 0, inside: false });
  const [active, setActive] = useState(false);
  const [state, setState] = useState<CursorState>({ mode: "idle" });

  function loop() {
    const m = motion.current;
    m.rx += (m.tx - m.rx) * 0.18;
    m.ry += (m.ty - m.ry) * 0.18;
    if (dot.current) dot.current.style.transform = `translate3d(${m.tx}px, ${m.ty}px, 0)`;
    if (ring.current) ring.current.style.transform = `translate3d(${m.rx}px, ${m.ry}px, 0)`;
    const settled = Math.abs(m.tx - m.rx) < 0.1 && Math.abs(m.ty - m.ry) < 0.1;
    m.frame = m.inside || !settled ? requestAnimationFrame(loop) : 0;
  }

  function track(event: PointerEvent<HTMLDivElement>) {
    const m = motion.current;
    m.tx = event.clientX;
    m.ty = event.clientY;
    const element = event.target instanceof Element ? event.target : null;
    const labelled = element?.closest<HTMLElement>("[data-cursor]");
    const next: CursorState = labelled
      ? { mode: "label", label: labelled.dataset.cursor }
      : element?.closest(INTERACTIVE)
        ? { mode: "link" }
        : { mode: "idle" };
    setState((current) =>
      current.mode === next.mode && current.label === next.label ? current : next,
    );
  }

  function onEnter(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || !window.matchMedia(ENABLED_QUERY).matches) return;
    const m = motion.current;
    m.inside = true;
    // Start the ring on the pointer so it does not fly in from the corner.
    m.tx = m.rx = event.clientX;
    m.ty = m.ry = event.clientY;
    setActive(true);
    track(event);
    if (!m.frame) m.frame = requestAnimationFrame(loop);
  }

  function onMove(event: PointerEvent<HTMLDivElement>) {
    if (!motion.current.inside || event.pointerType !== "mouse") return;
    track(event);
  }

  function onLeave() {
    motion.current.inside = false;
    setActive(false);
  }

  return (
    <div
      className={cx("relative", active && "cursor-zone-active", className)}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-90">
        <div ref={ring} className="absolute top-0 left-0">
          <div
            className={cx(
              "ease-expo-out flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-[width,height,background-color,border-color,opacity] duration-300",
              state.mode === "label" ? "border-sunrise bg-sunrise h-11 px-4" : "border-ink-950/70",
              state.mode === "idle" && "size-9",
              state.mode === "link" && "bg-ink-950/5 size-16",
              !active && "opacity-0",
            )}
          >
            {state.mode === "label" && (
              <span className="text-ink-950 text-sm font-semibold whitespace-nowrap">
                {state.label}
              </span>
            )}
          </div>
        </div>
        <div ref={dot} className="absolute top-0 left-0">
          <div
            className={cx(
              "bg-ink-950 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity",
              (!active || state.mode === "label") && "opacity-0",
            )}
          />
        </div>
      </div>
    </div>
  );
}
