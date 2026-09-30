import { cn } from "@/lib/utils";
import type { GlobeCity } from "./geo";

/** Same bounds as `public/images/world-dots-atlantic.svg` (scripts/build-globe-dots.mts). */
const BOUNDS = { west: -75, east: 25, north: 62, south: -38 };

const toPercent = ({ lat, lng }: GlobeCity) => ({
  left: `${((lng - BOUNDS.west) / (BOUNDS.east - BOUNDS.west)) * 100}%`,
  top: `${((BOUNDS.north - lat) / (BOUNDS.north - BOUNDS.south)) * 100}%`,
});

type GlobeFallbackProps = {
  cities: GlobeCity[];
  selected: string | null;
  onSelect: (city: string) => void;
  className?: string;
};

/**
 * Static dotted-map fallback for the globe (no WebGL, reduced motion, or while the 3D chunk
 * loads). Pins are mouse shortcuts only — the accessible controls are the city buttons.
 */
export function GlobeFallback({ cities, selected, onSelect, className }: GlobeFallbackProps) {
  return (
    <div className={cn("relative", className)} aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative static SVG */}
      <img
        src="/images/world-dots-atlantic.svg"
        alt=""
        className="absolute inset-0 size-full opacity-45"
      />
      {cities.map((city) => {
        const active = city.name === selected;
        return (
          <button
            key={city.name}
            type="button"
            tabIndex={-1}
            onClick={() => onSelect(city.name)}
            className="group absolute -translate-x-1/2 -translate-y-1/2 p-2"
            style={toPercent(city)}
          >
            <span
              className={cn(
                "relative block rounded-full transition-all duration-300",
                active ? "bg-paper size-4" : "bg-sunrise size-2.5 group-hover:scale-150",
              )}
            >
              <span className="bg-sunrise absolute inset-0 rounded-full motion-safe:animate-[pulse-ring_2.4s_ease-out_infinite]" />
            </span>
            {active && (
              <span className="bg-paper text-ink-950 absolute top-full left-1/2 mt-1 -translate-x-1/2 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap">
                {city.name}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
