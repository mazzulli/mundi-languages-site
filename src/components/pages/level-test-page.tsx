import type { Metadata } from "next";

import { GoogleFormEmbed } from "@/components/forms/google-form-embed";
import { WhatsAppIcon } from "@/components/icons/social-icons";
import { PageHero } from "@/components/sections/page-hero";
import { CtaLink } from "@/components/ui/cta-link";
import { courseInterestMessage, whatsappUrl } from "@/lib/whatsapp";
import { seoMetadata } from "@/lib/metadata";
import { levelTests, type LevelTest } from "@content/forms";
import { languages } from "@content/languages";

const testFor = (language: LevelTest["language"]) =>
  levelTests.find((test) => test.language === language)!;

export function levelTestMetadata(language: LevelTest["language"]): Metadata {
  const test = testFor(language);
  const name = languages[language].name.toLowerCase();
  return seoMetadata({
    title: test.title,
    description: `Faça o teste de nível de ${name} gratuito da Mundi Languages e descubra o ponto certo para começar o seu curso. Depois, agende uma consulta gratuita.`,
    path: test.path,
  });
}

/** Guidance around the test — generic, no promises about duration or scoring. */
const TIPS = [
  "Reserve um momento tranquilo e responda sem consultar dicionários ou tradutores.",
  "Não se preocupe com erros: o objetivo é encontrar o seu ponto de partida.",
];

/**
 * Redesigned level-test page (spec §5.4): instructions, the embedded Google Form (kept for
 * now) and what happens next. Legacy URLs are canonical (decided 2026-09-29).
 */
export function LevelTestPage({ language }: { language: LevelTest["language"] }) {
  const test = testFor(language);
  const info = languages[language];
  // TODO(cliente): estimated duration of each test (spec §5.4, "tempo estimado").

  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Teste de nível", href: "/teste-de-nivel/" }, { label: info.name }]}
        eyebrow={`Teste de nível · ${info.name}`}
        title={test.title}
        subtitle="Descubra o seu nível e comece o seu curso de idiomas do ponto certo."
        accent={`color-mix(in oklch, var(--color-lang-${language}) 70%, transparent)`}
      />

      <section className="bg-paper py-16 sm:py-24">
        <div className="container-site grid gap-12 lg:grid-cols-[20rem_1fr]">
          <aside className="h-fit space-y-8 lg:sticky lg:top-28">
            <div className="rounded-card bg-mist p-7">
              <h2 className="font-display text-ink-950 text-2xl">Antes de começar</h2>
              <ul className="text-ink-900 mt-5 grid gap-4 text-sm leading-relaxed">
                {TIPS.map((tip) => (
                  <li key={tip} className="flex gap-3">
                    <span
                      aria-hidden
                      className="bg-sunrise-deep mt-2 size-1.5 shrink-0 rounded-full"
                    />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
            <div className="on-ink rounded-card bg-ink-950 text-paper p-7">
              <h2 className="font-display text-2xl">E depois?</h2>
              <p className="text-primary-200 mt-3 text-sm leading-relaxed">
                Agende a sua consulta gratuita: conversamos sobre o resultado, os seus objetivos e
                montamos o seu plano de estudos.
              </p>
              <div className="mt-6 grid gap-3">
                <CtaLink href={`/agendamento/?idioma=${language}`} size="sm" magnetic={false}>
                  Agendar minha consulta gratuita
                </CtaLink>
                <a
                  href={whatsappUrl(courseInterestMessage(info.whatsappLabel))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-tint hover:text-paper inline-flex items-center gap-2 text-sm font-semibold"
                >
                  <WhatsAppIcon className="size-4" />
                  Tirar dúvidas no WhatsApp
                  <span className="sr-only">(abre em nova aba)</span>
                </a>
              </div>
            </div>
          </aside>

          <div>
            <GoogleFormEmbed
              formId={test.formId}
              title={`${test.title} — formulário`}
              height={2200}
            />
          </div>
        </div>
      </section>
    </>
  );
}
