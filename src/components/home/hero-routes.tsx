import { cities, type City } from "@content/cities";

/** Same bounds as `scripts/build-globe-dots.mts` (world-dots-atlantic.svg). */
const BOUNDS = { west: -75, east: 25, north: 62, south: -38, size: 1000 };

const project = ({ lat, lng }: Pick<City, "lat" | "lng">) => ({
  x: ((lng - BOUNDS.west) / (BOUNDS.east - BOUNDS.west)) * BOUNDS.size,
  y: ((BOUNDS.north - lat) / (BOUNDS.north - BOUNDS.south)) * BOUNDS.size,
});

const byName = (name: string) => cities.find((city) => city.name === name)!;

/** Flight-like routes between the cities of our students (spec §3.4 recurring element). */
const ROUTES: [string, string][] = [
  ["Recife", "Lisboa"],
  ["São Paulo", "Porto"],
  ["Lisboa", "Paris"],
  ["Porto", "Mullingar"],
  ["Chapecó", "Recife"],
  ["Lisboa", "Mullingar"],
];

function arcPath(from: City, to: City) {
  const a = project(from);
  const b = project(to);
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const distance = Math.hypot(b.x - a.x, b.y - a.y);
  // Control point lifted perpendicular to the segment → a curved "flight" route.
  const nx = -(b.y - a.y) / distance;
  const ny = (b.x - a.x) / distance;
  const lift = distance * 0.28;
  return `M${a.x.toFixed(1)} ${a.y.toFixed(1)} Q${(mx + nx * lift).toFixed(1)} ${(my + ny * lift).toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

export function HeroRoutes({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative static SVG */}
      <img
        src="/images/world-dots-atlantic.svg"
        alt=""
        className="absolute inset-0 size-full opacity-35"
      />
      <svg
        viewBox={`0 0 ${BOUNDS.size} ${BOUNDS.size}`}
        className="absolute inset-0 size-full overflow-visible"
      >
        <defs>
          <linearGradient id="route-gradient" x1="0" x2="1">
            <stop offset="0" stopColor="var(--color-brand-tint)" stopOpacity="0" />
            <stop offset="0.5" stopColor="var(--color-brand-tint)" />
            <stop offset="1" stopColor="var(--color-sunrise)" />
          </linearGradient>
        </defs>
        {ROUTES.map(([from, to], index) => (
          <path
            key={`${from}-${to}`}
            d={arcPath(byName(from), byName(to))}
            fill="none"
            stroke="url(#route-gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            pathLength={1}
            className="route-path"
            style={{ "--i": index } as React.CSSProperties}
          />
        ))}
      </svg>
      {/* Pins as HTML: their pulse animates transform/opacity on the compositor. */}
      {cities.map((city) => {
        const { x, y } = project(city);
        return (
          <span
            key={city.name}
            className="bg-sunrise absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ left: `${x / 10}%`, top: `${y / 10}%` }}
          >
            <span className="bg-sunrise/60 absolute inset-0 rounded-full motion-safe:animate-[pulse-ring_2.4s_ease-out_infinite]" />
          </span>
        );
      })}
    </div>
  );
}
