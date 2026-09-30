import type { Metadata } from "next";
import Link from "next/link";

import { CtaLink } from "@/components/ui/cta-link";
import { languageList } from "@content/languages";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false },
};

const MORE = [
  { label: "Empresas e Profissionais", href: "/empresas-e-profissionais/" },
  { label: "Desenvolvimento de Professores", href: "/solucoes-para-professores/" },
  { label: "Como Funciona", href: "/comofunciona/" },
  { label: "Blog", href: "/blog/" },
  { label: "Contato", href: "/contato/" },
];

/** Custom 404 (spec §8.1): points lost visitors to the courses and the level test. */
export default function NotFound() {
  return (
    <section
      aria-labelledby="not-found-title"
      className="on-ink bg-ink-950 text-paper relative isolate overflow-hidden pt-36 pb-24 sm:pt-44"
    >
      <div
        aria-hidden
        className="absolute -top-1/3 -left-1/4 -z-10 size-[70vmax] rounded-full bg-[radial-gradient(closest-side,oklch(0.55_0.07_172.5/0.5),transparent)]"
      />
      <div className="container-site">
        <p className="text-brand-tint text-xs font-semibold tracking-[0.18em] uppercase sm:text-sm">
          Erro 404
        </p>
        <h1 id="not-found-title" className="font-display text-display-2 mt-5 max-w-3xl">
          Esta página se perdeu na tradução.
        </h1>
        <p className="text-lead text-primary-200 mt-6 max-w-2xl">
          O endereço pode ter mudado ou não existe mais. Que tal escolher o seu idioma ou descobrir
          o seu nível?
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <CtaLink href="/teste-de-nivel/" size="lg">
            Fazer meu teste de nível grátis
          </CtaLink>
          <CtaLink href="/" variant="secondary-on-ink" size="lg">
            Voltar para a Home
          </CtaLink>
        </div>

        <nav aria-label="Cursos" className="mt-16">
          <h2 className="text-brand-tint text-sm font-semibold tracking-[0.16em] uppercase">
            Cursos
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {languageList.map((language) => (
              <li key={language.code}>
                <Link
                  href={language.path}
                  className="bg-paper/5 font-display ring-paper/10 hover:bg-paper hover:text-ink-950 flex items-center justify-between rounded-2xl px-5 py-4 text-xl ring-1 transition-colors"
                >
                  Cursos de {language.name}
                  <span aria-hidden>→</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Mais páginas" className="mt-10">
          <ul className="text-primary-200 flex flex-wrap gap-x-6 gap-y-3">
            {MORE.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:text-paper underline-offset-4 hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
