"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check, Loader2, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";

import { WhatsAppIcon } from "@/components/icons/social-icons";
import { buttonVariants } from "@/components/ui/button";
import { prefillFromContext, type PrefillContext } from "@/lib/needs-analysis/prefill";
import {
  emptyValues,
  fieldsOfStep,
  needsAnalysisSchema,
  type NeedsAnalysisValues,
} from "@/lib/needs-analysis/schema";
import { scrollToElement } from "@/lib/scroll-to";
import { cx } from "@/lib/utils";
import { whatsappUrl } from "@/lib/whatsapp";
import { needsAnalysisFields, needsAnalysisSteps, privacyNotice } from "@content/needs-analysis";
import { FormField } from "./fields";

const DRAFT_KEY = "ml-needs-analysis-draft";
const LAST_STEP = needsAnalysisSteps.length;

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; simulated: boolean }
  | { kind: "error"; message: string };

function readContext(): PrefillContext {
  const params = new URLSearchParams(window.location.search);
  return {
    idioma: params.get("idioma") ?? undefined,
    curso: params.get("curso") ?? undefined,
    perfil: params.get("perfil") ?? undefined,
  };
}

function readDraft(): Partial<NeedsAnalysisValues> | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Partial<NeedsAnalysisValues>) : null;
  } catch {
    return null;
  }
}

/** Initial values: empty form ← saved draft ← choice carried from the CTA (`?curso=`). */
function initialState() {
  const context = readContext();
  const draft = readDraft();
  const { values: prefill, program } = prefillFromContext(context);
  const values = { ...emptyValues(), ...draft } as Record<string, unknown>;
  for (const [key, list] of Object.entries(prefill)) {
    const current = (values[key] as string[] | undefined) ?? [];
    values[key] = [...new Set([...current, ...(list ?? [])])];
  }
  return { values: { ...values, context } as NeedsAnalysisValues, restored: !!draft, program };
}

/**
 * Native "Levantamento de Necessidades" (spec §5.4): same 24 questions as the legacy Google
 * Form, in 6 steps with per-step validation, a local draft and e-mail delivery.
 * Client-only (rendered with `ssr: false`): it reads the URL and the saved draft on mount.
 */
export default function NeedsAnalysisForm() {
  const [initial] = useState(initialState);
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [restored, setRestored] = useState(initial.restored);
  const top = useRef<HTMLDivElement>(null);

  const form = useForm<NeedsAnalysisValues>({
    defaultValues: initial.values,
    resolver: zodResolver(needsAnalysisSchema) as never,
    // No validation on blur: an error message disappearing on blur shifts the layout between
    // mousedown and mouseup on "Continuar", and the click is lost. Fields are validated when
    // advancing a step, and fields already in error re-validate as the visitor types (below).
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  // Draft in localStorage (spec §5.4) + live re-validation of fields that are in error.
  useEffect(() => {
    let timer: number | undefined;
    const unsubscribe = form.subscribe({
      formState: { values: true },
      callback: ({ values, name }) => {
        const root = name?.split(".")[0];
        if (root && form.getFieldState(root as never).invalid) void form.trigger(root as never);

        window.clearTimeout(timer);
        timer = window.setTimeout(() => {
          try {
            const draft = { ...(values as Record<string, unknown>) };
            delete draft.hp_check; // never persist the honeypot
            localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
          } catch {}
        }, 400);
      },
    });
    return () => {
      window.clearTimeout(timer);
      unsubscribe();
    };
  }, [form]);

  function goTo(next: number) {
    setStep(next);
    requestAnimationFrame(() => {
      if (!top.current) return;
      scrollToElement(top.current);
      top.current.focus({ preventScroll: true });
    });
  }

  function focusFirstError() {
    const first = fieldsOfStep(step).find((name) => form.getFieldState(name).invalid);
    if (!first) return;
    const element =
      document.getElementById(first) ?? document.querySelector<HTMLElement>(`[name="${first}"]`);
    if (!element) return;
    element.focus({ preventScroll: true });
    scrollToElement(element, { center: true });
  }

  async function next() {
    const valid = await form.trigger(fieldsOfStep(step) as never, { shouldFocus: false });
    if (valid) goTo(step + 1);
    else focusFirstError();
  }

  async function submit(values: NeedsAnalysisValues) {
    setStatus({ kind: "submitting" });
    try {
      const response = await fetch("/api/needs-analysis/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        delivery?: string;
        error?: string;
      };
      if (response.ok && result.ok) {
        try {
          localStorage.removeItem(DRAFT_KEY);
        } catch {}
        setStatus({ kind: "success", simulated: result.delivery === "simulated" });
        goTo(LAST_STEP + 1);
        return;
      }
      const message =
        response.status === 429
          ? "Recebemos muitas tentativas seguidas. Aguarde alguns minutos ou fale com a Karine pelo WhatsApp."
          : response.status === 422
            ? "Algumas respostas precisam de revisão. Volte às etapas anteriores e confira os campos destacados."
            : "Não conseguimos enviar agora. As suas respostas estão guardadas neste navegador — tente novamente ou fale com a Karine pelo WhatsApp.";
      setStatus({ kind: "error", message });
    } catch {
      setStatus({
        kind: "error",
        message:
          "Sem conexão no momento. As suas respostas estão guardadas — tente novamente em instantes.",
      });
    }
  }

  function startOver() {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {}
    form.reset({ ...emptyValues(), context: form.getValues("context") } as NeedsAnalysisValues);
    setRestored(false);
    goTo(1);
  }

  if (status.kind === "success") {
    return <SuccessScreen simulated={status.simulated} />;
  }

  const current = needsAnalysisSteps[step - 1]!;
  const fields = needsAnalysisFields.filter((field) => field.step === step);
  const progress = Math.round(((step - 1) / LAST_STEP) * 100);

  return (
    <FormProvider {...form}>
      <div ref={top} tabIndex={-1} className="scroll-mt-28 outline-none">
        {/* Progress */}
        <div className="flex items-center justify-between gap-4 text-sm">
          <p className="text-ink-950 font-semibold">
            Etapa {step} de {LAST_STEP} · {current.title}
          </p>
          <p className="text-muted tabular-nums">{progress}%</p>
        </div>
        <div
          role="progressbar"
          aria-label="Progresso do levantamento"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          className="bg-ink-900/10 mt-3 h-2 overflow-hidden rounded-full"
        >
          <div
            className="bg-sunrise ease-expo-out h-full origin-left rounded-full transition-transform duration-700"
            style={{ transform: `scaleX(${Math.max(progress, 4) / 100})` }}
          />
        </div>
        <ol className="text-muted mt-4 hidden gap-2 text-xs sm:flex">
          {needsAnalysisSteps.map((item) => (
            <li
              key={item.step}
              aria-current={item.step === step ? "step" : undefined}
              className={cx(
                "flex items-center gap-1.5 rounded-full px-3 py-1",
                item.step === step && "bg-ink-950 text-paper",
                item.step < step && "text-brand-primary",
              )}
            >
              {item.step < step && <Check aria-hidden className="size-3.5" />}
              {item.title}
            </li>
          ))}
        </ol>

        {restored && step === 1 && (
          <div className="bg-mist text-ink-900 mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm">
            <span>Recuperamos as respostas que você já tinha preenchido neste navegador.</span>
            <button
              type="button"
              onClick={startOver}
              className="text-brand-primary inline-flex items-center gap-1.5 font-semibold hover:underline"
            >
              <RotateCcw aria-hidden className="size-4" />
              Começar do zero
            </button>
          </div>
        )}

        {step === 2 && initial.program && (
          <p className="bg-mist text-ink-900 mt-6 rounded-2xl px-4 py-3 text-sm">
            Já marcamos <strong>{initial.program.name}</strong>, o programa que você escolheu. Pode
            ajustar à vontade.
          </p>
        )}
      </div>

      <form
        noValidate
        onSubmit={(event) => {
          if (step < LAST_STEP) {
            event.preventDefault();
            void next();
            return;
          }
          void form.handleSubmit(submit, () => focusFirstError())(event);
        }}
        className="mt-10"
        aria-labelledby="form-step-title"
      >
        <h2 id="form-step-title" className="sr-only">
          {current.title}
        </h2>

        {/* Honeypot (hidden from people and assistive tech). */}
        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            Website
            <input tabIndex={-1} autoComplete="new-password" {...form.register("hp_check")} />
          </label>
        </div>

        <div
          key={step}
          className="grid gap-10 motion-safe:animate-[intro-fade_0.5s_var(--ease-expo-out)_both]"
        >
          {fields.map((field) =>
            field.type === "multiple" && field.requiredWhen ? (
              <ConditionalField key={field.id} field={field} />
            ) : (
              <FormField key={field.id} field={field} />
            ),
          )}
        </div>

        {(step === 1 || step === LAST_STEP) && (
          <div className="border-ink-900/10 text-muted mt-10 rounded-2xl border p-5 text-sm leading-relaxed">
            <p>{privacyNotice.pt}</p>
            <p lang="en" className="mt-2">
              {privacyNotice.en}
            </p>
          </div>
        )}

        {status.kind === "error" && (
          <div
            role="alert"
            className="bg-lang-es/10 text-ink-950 ring-lang-es/30 mt-8 rounded-2xl p-5 text-sm ring-1"
          >
            <p>{status.message}</p>
            <a
              href={whatsappUrl(
                "Tentei enviar o levantamento de necessidades pelo site e não consegui.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-primary mt-3 inline-flex items-center gap-2 font-semibold hover:underline"
            >
              <WhatsAppIcon className="size-4" />
              Falar com a Karine no WhatsApp
              <span className="sr-only">(abre em nova aba)</span>
            </a>
          </div>
        )}

        <div className="border-ink-900/10 mt-10 flex flex-wrap items-center justify-between gap-3 border-t pt-8">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => goTo(step - 1)}
              className={buttonVariants({ variant: "ghost" })}
            >
              <ArrowLeft aria-hidden />
              Voltar
            </button>
          ) : (
            <span />
          )}
          <button
            type="submit"
            disabled={status.kind === "submitting"}
            className={buttonVariants({ size: "lg" })}
          >
            {step < LAST_STEP ? (
              <>
                Continuar
                <ArrowRight aria-hidden />
              </>
            ) : status.kind === "submitting" ? (
              <>
                <Loader2 aria-hidden className="animate-spin" />
                Enviando…
              </>
            ) : (
              "Enviar e agendar minha consulta"
            )}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}

/** "Se fala, quais são?" is only shown (and required) when the visitor speaks other languages. */
function ConditionalField({ field }: { field: (typeof needsAnalysisFields)[number] }) {
  const { watch } = useFormContext();
  if (field.type !== "multiple" || !field.requiredWhen) return null;
  const visible = watch(field.requiredWhen.field) === field.requiredWhen.equals;
  return visible ? <FormField field={field} /> : null;
}

function SuccessScreen({ simulated }: { simulated: boolean }) {
  return (
    <div role="status" className="py-10 text-center">
      <svg viewBox="0 0 96 96" className="mx-auto size-24" aria-hidden>
        <circle cx="48" cy="48" r="44" fill="none" stroke="var(--color-mist)" strokeWidth="6" />
        <circle
          cx="48"
          cy="48"
          r="44"
          fill="none"
          stroke="var(--color-sunrise)"
          strokeWidth="6"
          strokeLinecap="round"
          pathLength={1}
          className="success-ring"
        />
        <path
          d="M30 50 L43 62 L67 36"
          fill="none"
          stroke="var(--color-ink-950)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          className="success-check"
        />
      </svg>
      <h2 className="text-display-3 text-ink-950 mt-8">Recebemos o seu levantamento!</h2>
      <p className="text-lead text-muted mx-auto mt-4 max-w-xl">
        Obrigado por compartilhar os seus objetivos. Vamos analisar as suas respostas para desenhar
        o programa ideal e combinar a sua consulta gratuita.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <a
          href={whatsappUrl("Acabei de enviar o levantamento de necessidades pelo site.")}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ size: "lg" })}
        >
          <WhatsAppIcon />
          Falar agora no WhatsApp
          <span className="sr-only">(abre em nova aba)</span>
        </a>
        <Link href="/" className={buttonVariants({ variant: "secondary", size: "lg" })}>
          Voltar para a Home
        </Link>
      </div>
      {simulated && (
        <p className="text-muted mt-8 text-xs">
          Ambiente de desenvolvimento: o e-mail foi simulado (defina RESEND_API_KEY e
          CONTACT_EMAIL_TO).
        </p>
      )}
    </div>
  );
}
