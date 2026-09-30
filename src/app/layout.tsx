import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";

import { ExitIntent } from "@/components/layout/exit-intent";
import { FloatingActions } from "@/components/layout/floating-actions";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Preloader } from "@/components/motion/preloader";
import { RevealObserver } from "@/components/motion/reveal-observer";
import { SmoothScrollProvider } from "@/components/motion/smooth-scroll-provider";
import { HydrationBoundary } from "@/components/ui/hydration-boundary";
import { site } from "@content/site";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Cursos de Idiomas Online Personalizados | Mundi Languages",
    template: "%s | Mundi Languages",
  },
  description: site.tagline,
  applicationName: site.name,
  // Main market confirmed as Brazil (pt-BR) on 2026-09-29.
  openGraph: { type: "website", locale: "pt_BR", siteName: site.name },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0b1220",
  colorScheme: "light",
};

/**
 * Runs before first paint: enables JS-only styles (reveal) and shows the preloader only on
 * the first page view of the session.
 */
const BOOT_SCRIPT = `(function(){var d=document.documentElement;d.classList.add("js");try{if(sessionStorage.getItem("ml-visited")){d.classList.add("no-preloader")}else{sessionStorage.setItem("ml-visited","1")}}catch(e){d.classList.add("no-preloader")}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${jakarta.variable}`}
      // The boot script adds classes to <html> before hydration.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      </head>
      {/*
        Browser extensions (e.g. ColorZilla adds `cz-shortcut-listen`) inject attributes into
        <body> before hydration. Only the body's own attributes are exempt — children are not.
      */}
      <body className="min-h-dvh" suppressHydrationWarning>
        <Preloader />
        <SmoothScrollProvider>
          <SiteHeader />
          <main id="conteudo" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <HydrationBoundary>
            <SiteFooter />
          </HydrationBoundary>
          <FloatingActions />
          <ExitIntent />
          <RevealObserver />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
