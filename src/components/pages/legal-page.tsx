import { PageHero } from "@/components/sections/page-hero";
import { CtaLink } from "@/components/ui/cta-link";
import { seoMetadata } from "@/lib/metadata";
import { privacyNotice } from "@content/needs-analysis";
import { legalPages } from "@content/pages";
import { site } from "@content/site";

type LegalKey = keyof typeof legalPages;

const DESCRIPTIONS: Record<LegalKey, string> = {
  privacy:
    "Política de Privacidade da Mundi Languages: como recolhemos e usamos os seus dados nos formulários e contatos do site. Dúvidas? Fale com a nossa equipe.",
  terms:
    "Termos de uso do site da Mundi Languages. Consulte as condições de uso do site e fale com a nossa equipe em caso de dúvidas sobre os nossos cursos.",
};

export function legalMetadata(key: LegalKey) {
  const page = legalPages[key];
  return {
    ...seoMetadata({ title: page.title, description: DESCRIPTIONS[key], path: page.path }),
    // Kept out of the index until the client's legal text is published (spec §11.7).
    robots: page.body ? undefined : { index: false, follow: true },
  };
}

/**
 * Privacy policy / terms (spec §6). The legal text is TODO(cliente): until it arrives the page
 * shows only facts already on the site — the privacy notice of the forms and the contact.
 */
export function LegalPage({ page: key }: { page: LegalKey }) {
  const page = legalPages[key];
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: page.title }]}
        eyebrow="Informações legais"
        title={page.title}
        subtitle={
          page.body ? "Leia com atenção as informações abaixo." : "Documento em preparação."
        }
      />
      <section className="bg-paper py-16 sm:py-24">
        <div className="container-site text-ink-900 max-w-3xl text-lg leading-relaxed">
          {page.body ? (
            <div className="whitespace-pre-line">{page.body}</div>
          ) : (
            <>
              <p>
                O texto completo deste documento está sendo finalizado e será publicado nesta página
                em breve.
              </p>
              {key === "privacy" && (
                <blockquote className="border-sunrise font-display text-ink-950 mt-8 border-l-4 pl-6 text-2xl">
                  {privacyNotice.pt}
                </blockquote>
              )}
              <p className="mt-8">
                Em caso de dúvidas, escreva para{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="text-sunrise-deep font-semibold underline underline-offset-4"
                >
                  {site.email}
                </a>
                .
              </p>
              <div className="mt-10">
                <CtaLink href="/contato/" variant="secondary">
                  Falar com a equipe
                </CtaLink>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
