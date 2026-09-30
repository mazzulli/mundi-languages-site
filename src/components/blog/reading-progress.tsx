"use client";

import { useEffect, useRef } from "react";

/**
 * Reading progress bar at the top of blog posts (spec §4.1). Tracks the article element;
 * transform-only (scaleX), updated at most once per frame.
 */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const article = document.getElementById(targetId);
    // Capture the nodes: on navigation React detaches the ref before this effect's cleanup
    // runs, and a scroll event (Lenis resets the scroll) can fire in between.
    const fill = bar.current;
    const track = fill?.parentElement;
    if (!article || !fill || !track) return;
    let frame = 0;
    let disposed = false;
    const update = () => {
      frame = 0;
      if (disposed || !article.isConnected) return;
      const rect = article.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.6;
      const progress = Math.min(1, Math.max(0, -rect.top / Math.max(total, 1)));
      fill.style.transform = `scaleX(${progress})`;
      track.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
    };
    const schedule = () => {
      if (!frame && !disposed) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      disposed = true;
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [targetId]);

  return (
    <div
      role="progressbar"
      aria-label="Progresso de leitura"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      className="fixed inset-x-0 top-0 z-[60] h-1 bg-transparent"
    >
      <div ref={bar} className="bg-sunrise h-full origin-left scale-x-0" />
    </div>
  );
}
