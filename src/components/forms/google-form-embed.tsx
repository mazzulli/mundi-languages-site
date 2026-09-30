import { ExternalLink } from "lucide-react";

import { googleFormUrl } from "@content/forms";

type GoogleFormEmbedProps = {
  formId: string;
  /** Accessible title of the iframe. */
  title: string;
  /** Height of the embedded form (Google Forms do not auto-resize). */
  height?: number;
};

/**
 * Embedded Google Form (level tests, partner teachers, teachers' needs analysis — kept as
 * Google Forms in this phase, spec §5.4). Lazy-loaded, with a direct link as fallback.
 */
export function GoogleFormEmbed({ formId, title, height = 1600 }: GoogleFormEmbedProps) {
  const directUrl = googleFormUrl(formId).replace("?embedded=true", "");
  return (
    <div>
      <div className="rounded-card bg-paper shadow-card ring-ink-900/5 overflow-hidden ring-1">
        <iframe
          src={googleFormUrl(formId)}
          title={title}
          loading="lazy"
          width="100%"
          height={height}
          className="block w-full border-0"
        >
          Carregando…
        </iframe>
      </div>
      <p className="text-muted mt-4 text-sm">
        O formulário não carregou?{" "}
        <a
          href={directUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-primary inline-flex items-center gap-1 font-semibold hover:underline"
        >
          Abrir em uma nova aba
          <ExternalLink aria-hidden className="size-3.5" />
        </a>
      </p>
    </div>
  );
}
