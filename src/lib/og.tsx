import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";

import { ogSize, type OgEntry } from "@/lib/og-registry";

/**
 * Shared renderer of the generated Open Graph images (spec §8.1) — one per page, in the new
 * visual identity. Every route using it is static, so the images are rendered at build time.
 */

// Satori does not parse OKLCH: hex equivalents of the design tokens (globals.css).
const COLORS = {
  ink: "#0b1220",
  paper: "#faf8f4",
  tint: "#a5c7c2",
  primary200: "#d0e3dc",
  sunrise: "#fa8746",
  glow: "#427f6d",
};

let assets:
  Promise<{ logo: string; fonts: ConstructorParameters<typeof ImageResponse>[1] }> | undefined;

function loadAssets() {
  // Literal paths so the file tracer bundles only these files (a variable path would make it
  // trace the whole project into the server output).
  assets ??= Promise.all([
    readFile(path.join(process.cwd(), "src/assets/og/logo-horizontal-light.png")),
    readFile(path.join(process.cwd(), "src/assets/og/fraunces-latin-600-normal.woff")),
    readFile(path.join(process.cwd(), "src/assets/og/plus-jakarta-sans-latin-500-normal.woff")),
    readFile(path.join(process.cwd(), "src/assets/og/plus-jakarta-sans-latin-600-normal.woff")),
  ]).then(([logo, fraunces, jakarta500, jakarta600]) => ({
    logo: `data:image/png;base64,${logo.toString("base64")}`,
    fonts: {
      fonts: [
        { name: "Fraunces", data: fraunces, weight: 600, style: "normal" },
        { name: "Jakarta", data: jakarta500, weight: 500, style: "normal" },
        { name: "Jakarta", data: jakarta600, weight: 600, style: "normal" },
      ],
    },
  }));
  return assets;
}

export async function ogImage({ eyebrow, title, accent = "#5d57a4" }: OgEntry) {
  const { logo, fonts } = await loadAssets();
  const titleSize = title.length > 70 ? 58 : title.length > 42 ? 68 : 80;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        backgroundColor: COLORS.ink,
        backgroundImage: `radial-gradient(circle at 0% 0%, ${COLORS.glow}cc 0%, transparent 55%), radial-gradient(circle at 100% 110%, ${accent}aa 0%, transparent 50%)`,
        color: COLORS.paper,
        fontFamily: "Jakarta",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- Satori renders plain <img> */}
      <img src={logo} width={264} height={66} alt="" />
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: COLORS.tint,
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            fontFamily: "Fraunces",
            fontSize: titleSize,
            lineHeight: 1.08,
            maxWidth: 1000,
            letterSpacing: -1,
          }}
        >
          {title}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 26, color: COLORS.primary200 }}>mundilanguages.com</div>
        <div
          style={{
            display: "flex",
            padding: "14px 30px",
            borderRadius: 999,
            backgroundColor: COLORS.sunrise,
            color: COLORS.ink,
            fontSize: 24,
            fontWeight: 600,
          }}
        >
          Teste de nível grátis
        </div>
      </div>
    </div>,
    { ...ogSize, ...fonts },
  );
}
