"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { WhatsAppIcon } from "@/components/icons/social-icons";
import { buttonVariants } from "@/components/ui/button";
import { contactSchema, type ContactValues } from "@/lib/contact/schema";
import { cx } from "@/lib/utils";
import { whatsappUrl } from "@/lib/whatsapp";
import { contactPage } from "@content/pages";

const inputClass =
  "mt-2 w-full rounded-2xl border border-ink-900/15 bg-paper px-4 py-3 text-base text-ink-950 outline-none transition-colors focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 aria-invalid:border-lang-es";

type Status = "idle" | "sending" | "sent" | "error";

/** Short contact form of /contato/ (spec §11.3). */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", whatsapp: "", message: "", hp_check: "" },
    mode: "onTouched",
  });

  async function onSubmit(values: ContactValues) {
    setStatus("sending");
    const response = await fetch("/api/contact/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    }).catch(() => null);
    if (response?.ok) {
      setStatus("sent");
      reset();
    } else {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="rounded-card bg-mist p-8 text-center">
        <span className="bg-sunrise text-ink-950 mx-auto grid size-14 place-items-center rounded-full">
          <Check aria-hidden className="size-7" />
        </span>
        <p className="font-display text-ink-950 mt-5 text-2xl">Mensagem enviada!</p>
        <p className="text-muted mt-2">
          Obrigado pelo contato. Para uma resposta mais rápida, fale também pelo WhatsApp.
        </p>
        <a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className={cx(buttonVariants({ size: "md" }), "mt-6")}
        >
          <WhatsAppIcon />
          Falar agora no WhatsApp
          <span className="sr-only">(abre em nova aba)</span>
        </a>
      </div>
    );
  }

  const field = (id: keyof ContactValues, label: string, optional = false) => ({
    label: (
      <label htmlFor={`contact-${id}`} className="text-ink-950 font-medium">
        {label}
        {optional ? (
          <span className="text-muted ml-1 text-sm">(opcional)</span>
        ) : (
          <span aria-hidden className="text-sunrise-deep">
            {" "}
            *
          </span>
        )}
      </label>
    ),
    props: {
      id: `contact-${id}`,
      "aria-invalid": errors[id] ? true : undefined,
      "aria-describedby": errors[id] ? `contact-${id}-error` : undefined,
      className: inputClass,
      ...register(id),
    },
    error: errors[id]?.message ? (
      <p id={`contact-${id}-error`} role="alert" className="text-lang-es mt-2 text-sm font-medium">
        {errors[id]?.message}
      </p>
    ) : null,
  });

  const name = field("name", "Nome");
  const email = field("email", "E-mail");
  const whatsapp = field("whatsapp", "WhatsApp com código do país", true);
  const message = field("message", "Mensagem");

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
      <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <input tabIndex={-1} autoComplete="new-password" {...register("hp_check")} />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          {name.label}
          <input autoComplete="name" {...name.props} />
          {name.error}
        </div>
        <div>
          {email.label}
          <input type="email" autoComplete="email" {...email.props} />
          {email.error}
        </div>
      </div>
      <div>
        {whatsapp.label}
        <input type="tel" autoComplete="tel" placeholder="+55 81 99999-9999" {...whatsapp.props} />
        {whatsapp.error}
      </div>
      <fieldset aria-describedby={errors.profile ? "contact-profile-error" : undefined}>
        <legend className="text-ink-950 font-medium">
          Você é{" "}
          <span aria-hidden className="text-sunrise-deep">
            *
          </span>
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {contactPage.formProfiles.map((profile) => (
            <label
              key={profile}
              className="border-ink-900/15 hover:border-brand-primary has-checked:border-ink-950 has-checked:bg-ink-950 has-checked:text-paper has-focus-visible:ring-sunrise-deep inline-flex cursor-pointer items-center rounded-full border px-4 py-2 text-sm font-medium transition-colors has-focus-visible:ring-2"
            >
              <input type="radio" value={profile} className="sr-only" {...register("profile")} />
              {profile}
            </label>
          ))}
        </div>
        {errors.profile && (
          <p
            id="contact-profile-error"
            role="alert"
            className="text-lang-es mt-2 text-sm font-medium"
          >
            {errors.profile.message}
          </p>
        )}
      </fieldset>
      <div>
        {message.label}
        <textarea rows={5} {...message.props} />
        {message.error}
      </div>

      {status === "error" && (
        <p
          role="alert"
          className="bg-lang-es/10 text-ink-950 ring-lang-es/30 rounded-2xl p-4 text-sm ring-1"
        >
          Não conseguimos enviar agora.{" "}
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-primary font-semibold underline"
          >
            Fale com a Karine pelo WhatsApp
          </a>
          .
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className={buttonVariants({ size: "lg" })}
        >
          {status === "sending" ? (
            <>
              <Loader2 aria-hidden className="animate-spin" />
              Enviando…
            </>
          ) : (
            "Enviar mensagem"
          )}
        </button>
        <Link
          href="/agendamento/"
          className="text-brand-primary text-sm font-semibold hover:underline"
        >
          Ou preencha o levantamento completo
        </Link>
      </div>
    </form>
  );
}
