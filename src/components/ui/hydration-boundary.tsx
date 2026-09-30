import { Suspense, type ReactNode } from "react";

/**
 * Selective hydration boundary. Nothing inside suspends, so the server HTML is identical,
 * but React hydrates each boundary as a separate, interruptible unit instead of one long
 * task for the whole page — keeping Total Blocking Time low on long pages (spec §8.1).
 */
export function HydrationBoundary({ children }: { children: ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>;
}
