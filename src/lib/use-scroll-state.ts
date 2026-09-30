"use client";

import { useEffect, useState } from "react";

type ScrollState = { y: number; direction: "up" | "down" };

/**
 * Passive, rAF-throttled window scroll tracking. Returns coarse state only,
 * so consumers re-render when a derived boolean changes, not on every frame.
 */
export function useScrollState<T>(select: (state: ScrollState) => T): T {
  const [value, setValue] = useState<T>(() => select({ y: 0, direction: "up" }));

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const read = () => {
      frame = 0;
      const y = window.scrollY;
      const direction = y > lastY ? "down" : "up";
      if (y !== lastY) lastY = y;
      setValue(select({ y, direction }));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(read);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
    // `select` is expected to be a stable, pure function defined at module scope.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return value;
}
