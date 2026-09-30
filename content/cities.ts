/**
 * Cities of the testimonials, for the Home globe (spec §4.3 / A.14).
 * 12 cities in 4 countries — derived from `testimonials.ts`, verified by `pnpm check:content`.
 */
import { testimonials, type TestimonialId } from "./testimonials";

export type City = {
  name: string;
  country: string;
  lat: number;
  lng: number;
};

export const cities: City[] = [
  { name: "Lisboa", country: "Portugal", lat: 38.7223, lng: -9.1393 },
  { name: "Porto", country: "Portugal", lat: 41.1579, lng: -8.6291 },
  { name: "Setúbal", country: "Portugal", lat: 38.5244, lng: -8.8882 },
  { name: "Évora", country: "Portugal", lat: 38.5714, lng: -7.9135 },
  { name: "Recife", country: "Brasil", lat: -8.0476, lng: -34.877 },
  { name: "Olinda", country: "Brasil", lat: -8.0089, lng: -34.8553 },
  { name: "Jaboatão", country: "Brasil", lat: -8.1127, lng: -35.0147 },
  { name: "Caruaru", country: "Brasil", lat: -8.2836, lng: -35.9761 },
  { name: "Chapecó", country: "Brasil", lat: -27.1004, lng: -52.6152 },
  { name: "São Paulo", country: "Brasil", lat: -23.5505, lng: -46.6333 },
  { name: "Mullingar", country: "Irlanda", lat: 53.5259, lng: -7.3381 },
  { name: "Paris", country: "França", lat: 48.8566, lng: 2.3522 },
];

export const countries = [...new Set(cities.map((city) => city.country))];

/** Testimonial ids for a city, in appendix order. */
export function testimonialIdsByCity(cityName: string): TestimonialId[] {
  return testimonials.filter((t) => t.city === cityName).map((t) => t.id);
}
