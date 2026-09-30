import { ogImage } from "@/lib/og";
import { ogImages } from "@/lib/og-registry";

/**
 * Generated Open Graph images (spec §8.1) at `/og/<key>.png`. Not `opengraph-image.tsx`: with
 * `trailingSlash: true` its URL answers a 308 to the slashed path, and some link-preview bots
 * (WhatsApp, LinkedIn) do not follow redirects for images. A path with an extension is never
 * redirected. All images are rendered at build time.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(ogImages).map((key) => ({ image: `${key}.png` }));
}

export async function GET(_request: Request, { params }: RouteContext<"/og/[image]">) {
  const { image } = await params;
  const entry = ogImages[image.replace(/\.png$/, "")];
  if (!entry) return new Response("Not found", { status: 404 });
  return ogImage(entry);
}
