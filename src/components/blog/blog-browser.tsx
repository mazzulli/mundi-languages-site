"use client";

import { Search, X } from "lucide-react";
import { useDeferredValue, useId, useState, type ReactNode } from "react";

import { PostCard, type PostCardData } from "./post-card";

const normalize = (value: string) => value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

type BlogBrowserProps = {
  /** Every post (the search spans all pages). */
  allPosts: PostCardData[];
  /** Server-rendered listing shown while the search is empty (current page / category). */
  children: ReactNode;
};

/** Client-side search over all posts (spec §7.6). The paginated listing is plain SSR. */
export function BlogBrowser({ allPosts, children }: BlogBrowserProps) {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const inputId = useId();
  const terms = normalize(deferred).split(/\s+/).filter(Boolean);
  const results = terms.length
    ? allPosts.filter((post) => {
        const haystack = normalize(`${post.title} ${post.excerpt} ${post.categoryName}`);
        return terms.every((term) => haystack.includes(term));
      })
    : null;

  return (
    <div>
      <div role="search" className="relative max-w-xl">
        <label htmlFor={inputId} className="sr-only">
          Buscar no blog
        </label>
        <Search
          aria-hidden
          className="text-muted pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2"
        />
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar artigos (ex.: entrevista, gamificação)"
          className="border-ink-900/15 bg-paper text-ink-950 focus:border-brand-primary focus:ring-brand-primary/20 h-14 w-full rounded-full border pr-12 pl-13 text-base outline-none focus:ring-2"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Limpar busca"
            className="text-muted hover:bg-ink-900/5 absolute top-1/2 right-3 grid size-9 -translate-y-1/2 place-items-center rounded-full"
          >
            <X aria-hidden className="size-4" />
          </button>
        )}
      </div>

      <p aria-live="polite" className="sr-only">
        {results ? `${results.length} artigo(s) encontrado(s)` : ""}
      </p>

      {results ? (
        <div className="mt-12">
          <p className="text-muted text-sm">
            {results.length
              ? `${results.length} artigo${results.length > 1 ? "s" : ""} para “${deferred.trim()}”`
              : `Nenhum artigo encontrado para “${deferred.trim()}”.`}
          </p>
          <ul className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.map((post) => (
              <li key={post.slug}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
