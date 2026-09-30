import Image, { type ImageProps } from "next/image";

import type { SiteImage } from "@content/types";
import manifest from "@content/generated/image-manifest.json";

type Manifest = Record<string, { width: number; height: number; blurDataURL: string }>;

type LegacyImageProps = Omit<ImageProps, "src" | "alt" | "width" | "height" | "placeholder"> & {
  image: SiteImage;
  /** Force `fill` layout (parent must be positioned). */
  fill?: boolean;
};

/**
 * `next/image` for images migrated from WordPress: intrinsic size and blur placeholder
 * come from `content/generated/image-manifest.json` (`pnpm images:manifest`).
 */
export function LegacyImage({ image, fill, ...props }: LegacyImageProps) {
  const entry = (manifest as Manifest)[image.src];
  if (!entry) throw new Error(`Image not in manifest: ${image.src} — run pnpm images:manifest`);

  const src = `/images/legacy/${image.src}`;
  return fill ? (
    <Image
      src={src}
      alt={image.alt}
      fill
      placeholder="blur"
      blurDataURL={entry.blurDataURL}
      {...props}
    />
  ) : (
    <Image
      src={src}
      alt={image.alt}
      width={entry.width}
      height={entry.height}
      placeholder="blur"
      blurDataURL={entry.blurDataURL}
      {...props}
    />
  );
}
