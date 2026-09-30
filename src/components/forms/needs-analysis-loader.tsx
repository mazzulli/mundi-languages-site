"use client";

import dynamic from "next/dynamic";

/** The form reads the URL and the saved draft on mount, so it renders on the client only. */
const NeedsAnalysisForm = dynamic(() => import("./needs-analysis-form"), {
  ssr: false,
  loading: () => (
    // role="status": announced politely; the skeleton itself is decorative.
    <div role="status" aria-busy="true" className="grid gap-6">
      <span className="sr-only">Carregando o formulário…</span>
      <div aria-hidden className="bg-ink-900/10 h-2 animate-pulse rounded-full" />
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} aria-hidden className="bg-ink-900/5 h-20 animate-pulse rounded-2xl" />
      ))}
    </div>
  ),
});

export function NeedsAnalysisLoader() {
  return <NeedsAnalysisForm />;
}
