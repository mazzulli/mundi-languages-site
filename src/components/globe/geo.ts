import type { City } from "@content/cities";

/** Unit-sphere position for lat/lng, with lng = 0 facing +Z (towards the camera). */
export function latLngToVector(lat: number, lng: number, radius = 1): [number, number, number] {
  const phi = (lat * Math.PI) / 180;
  const lambda = (lng * Math.PI) / 180;
  return [
    radius * Math.cos(phi) * Math.sin(lambda),
    radius * Math.sin(phi),
    radius * Math.cos(phi) * Math.cos(lambda),
  ];
}

/** Globe rotation (Euler XYZ) that brings lat/lng to the front of the camera. */
export function rotationToFace(lat: number, lng: number): [number, number] {
  return [(lat * Math.PI) / 180, (-lng * Math.PI) / 180];
}

/** Flight routes between the cities of our students (spec §4.3: "arcos animados"). */
export const GLOBE_ROUTES: [string, string][] = [
  ["Recife", "Lisboa"],
  ["São Paulo", "Porto"],
  ["Lisboa", "Paris"],
  ["Porto", "Mullingar"],
  ["Chapecó", "Recife"],
  ["Recife", "Paris"],
  ["Lisboa", "Évora"],
  ["Olinda", "Setúbal"],
];

export type GlobeCity = Pick<City, "name" | "country" | "lat" | "lng">;

/** Where the globe looks when nothing is selected: the Atlantic between Brazil and Europe. */
export const DEFAULT_VIEW = { lat: 12, lng: -25 };
