import { z } from "zod";

import { contactPage } from "@content/pages";

/** Short contact form (spec §11.3): name, e-mail, WhatsApp, profile and message. */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Informe o seu nome.").max(120),
  email: z.email("Informe um e-mail válido.").max(200),
  whatsapp: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || /^\+?[\d\s().-]{8,20}$/.test(v),
      "Informe o número com o código do país.",
    ),
  profile: z.enum(contactPage.formProfiles as unknown as [string, ...string[]], {
    error: "Escolha o seu perfil.",
  }),
  message: z.string().trim().min(10, "Escreva a sua mensagem (mínimo de 10 caracteres).").max(3000),
  /**
   * Honeypot. Deliberately NOT validated here: browser autofill can fill hidden fields, and a
   * failing rule on an invisible input blocks the submit silently. The API drops filled ones.
   */
  hp_check: z.string().max(500).optional(),
});

export type ContactValues = z.infer<typeof contactSchema>;
