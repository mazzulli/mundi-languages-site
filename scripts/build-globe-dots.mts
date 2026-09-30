/**
 * Generates `content/generated/globe-dots.json`: a lat/lng grid of points that fall on land
 * (Natural Earth 110m via world-atlas). Used by the 3D globe and its SVG fallback, so no
 * earth texture needs to be shipped.
 *
 * Usage: pnpm globe:dots
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

import { geoContains } from "d3-geo";
import type { FeatureCollection } from "geojson";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";

const STEP = 2.2; // degrees between dots
const OUT = path.join(process.cwd(), "content", "generated", "globe-dots.json");

async function main() {
  const require = createRequire(import.meta.url);
  const topology = JSON.parse(
    await readFile(require.resolve("world-atlas/land-110m.json"), "utf8"),
  ) as Topology;
  const land = feature(topology, topology.objects.land!) as unknown as FeatureCollection;

  const dots: [number, number][] = [];
  for (let lat = -58; lat <= 78; lat += STEP) {
    // Keep a roughly even density on the sphere: fewer dots near the poles.
    const lngStep = STEP / Math.max(Math.cos((lat * Math.PI) / 180), 0.25);
    for (let lng = -180; lng < 180; lng += lngStep) {
      if (geoContains(land, [lng, lat])) dots.push([+lat.toFixed(1), +lng.toFixed(1)]);
    }
  }

  await mkdir(path.dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(dots));
  console.log(`${dots.length} land dots → ${path.relative(process.cwd(), OUT)}`);

  await writeAtlanticMap(land);
}

/**
 * Static dotted map of the Atlantic (Brazil ↔ Western Europe) for the hero middle layer.
 * Equirectangular projection; the same bounds are exported in `ATLANTIC_BOUNDS` so the
 * animated routes can be drawn on top in the same coordinate system.
 */
async function writeAtlanticMap(land: FeatureCollection) {
  const { west, east, north, south, width, height } = ATLANTIC_BOUNDS;
  const step = 1.25;
  const circles: string[] = [];
  for (let lat = north; lat >= south; lat -= step) {
    for (let lng = west; lng <= east; lng += step) {
      if (!geoContains(land, [lng, lat])) continue;
      const x = ((lng - west) / (east - west)) * width;
      const y = ((north - lat) / (north - south)) * height;
      circles.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.1"/>`);
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" fill="#a5c7c2">${circles.join("")}</svg>`;
  const out = path.join(process.cwd(), "public", "images", "world-dots-atlantic.svg");
  await writeFile(out, svg);
  console.log(`${circles.length} dots → ${path.relative(process.cwd(), out)}`);
}

/** Keep in sync with `src/components/home/hero-routes.tsx`. */
const ATLANTIC_BOUNDS = { west: -75, east: 25, north: 62, south: -38, width: 1000, height: 1000 };

main();
