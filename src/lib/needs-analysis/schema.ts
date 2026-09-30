import { z } from "zod";

import { needsAnalysisFields, type NeedsAnalysisField } from "@content/needs-analysis";

/**
 * Validation for the "Levantamento de Necessidades" form, generated from the 24 fields of
 * `content/needs-analysis.ts` (Appendix A.12). Shared by the browser (React Hook Form) and
 * the API route, so both always enforce the same rules.
 */

const OTHER = "Outro";
const message = {
  required: "Campo obrigatório.",
  choose: "Escolha uma opção.",
  chooseMany: "Escolha pelo menos uma opção.",
  email: "Informe um e-mail válido.",
  phone: "Informe o número com o código do país (ex. +351 968145365).",
  date: "Informe uma data válida.",
  other: "Descreva a opção “Outro”.",
  grid: "Responda todas as linhas.",
  long: "Texto muito longo.",
};

const text = (max = 300) => z.string().trim().max(max, message.long);

function fieldSchema(field: NeedsAnalysisField) {
  switch (field.type) {
    case "email":
      return z.email(message.email).max(200);
    case "date":
      return z.iso.date(message.date);
    case "tel":
      return z
        .string()
        .trim()
        .refine((v) => v === "" || /^\+?[\d\s().-]{8,20}$/.test(v), message.phone);
    case "text":
      return field.required ? text().min(1, message.required) : text();
    case "textarea":
      return field.required ? text(3000).min(1, message.required) : text(3000);
    case "yes-no":
      return z.enum(["Sim", "Não"], { error: message.choose });
    case "single":
      return z.enum(field.options as [string, ...string[]], { error: message.choose });
    case "multiple":
      // Minimum enforced below (it may depend on another answer — `requiredWhen`).
      return z.array(z.enum(field.options as [string, ...string[]])).max(field.options.length);
    case "grid":
      return z.record(z.string(), z.string());
    case "schedule":
      return z.array(z.string().max(12)).max(field.days.length * field.times.length);
  }
}

const hasOther = (field: NeedsAnalysisField) =>
  (field.type === "single" || field.type === "multiple") && field.options.includes(OTHER);

/** Name of the free-text companion of an "Outro" option. */
export const otherKey = (fieldId: string) => `${fieldId}Other`;

const shape: Record<string, z.ZodType> = {};
for (const field of needsAnalysisFields) {
  shape[field.id] = fieldSchema(field);
  if (hasOther(field)) shape[otherKey(field.id)] = text(200);
}

/** Context carried from the CTA that opened the form (`?idioma=&curso=&perfil=`). */
export const contextSchema = z.object({
  idioma: z.string().max(4).optional(),
  curso: z.string().max(80).optional(),
  perfil: z.string().max(20).optional(),
});

export const needsAnalysisSchema = z
  .object({
    ...shape,
    context: contextSchema.optional(),
    /** Honeypot (see contact schema): never validated on the client, dropped by the API. */
    hp_check: z.string().max(500).optional(),
  })
  .superRefine(
    (values, ctx) => {
      const data = values as Record<string, unknown>;
      for (const field of needsAnalysisFields) {
        const value = data[field.id];

        if (field.type === "multiple") {
          const list = (value as string[] | undefined) ?? [];
          const condition = field.requiredWhen;
          const required = condition ? data[condition.field] === condition.equals : field.required;
          if (required && list.length === 0) {
            ctx.addIssue({ code: "custom", path: [field.id], message: message.chooseMany });
          }
          if (list.includes(OTHER) && !String(data[otherKey(field.id)] ?? "").trim()) {
            ctx.addIssue({ code: "custom", path: [otherKey(field.id)], message: message.other });
          }
        }

        if (
          field.type === "single" &&
          value === OTHER &&
          !String(data[otherKey(field.id)] ?? "").trim()
        ) {
          ctx.addIssue({ code: "custom", path: [otherKey(field.id)], message: message.other });
        }

        if (field.type === "grid" && field.required) {
          const answers = (value as Record<string, string> | undefined) ?? {};
          const columns = field.columns.map(String);
          for (const row of field.rows) {
            if (!columns.includes(answers[row] ?? "")) {
              ctx.addIssue({ code: "custom", path: [field.id, row], message: message.grid });
            }
          }
        }
      }
    },
    // Run even when other fields already failed (empty enums abort by default): otherwise the
    // multiple-choice, grid and conditional rules of a step would never be reported.
    { when: () => true },
  );

export type NeedsAnalysisValues = z.infer<typeof needsAnalysisSchema> & Record<string, unknown>;

/** Empty form values (today's date pre-filled, as on the legacy Google Form). */
export function emptyValues(today = new Date().toISOString().slice(0, 10)) {
  const values: Record<string, unknown> = { hp_check: "" };
  for (const field of needsAnalysisFields) {
    switch (field.type) {
      case "multiple":
      case "schedule":
        values[field.id] = [];
        break;
      case "grid":
        values[field.id] = {};
        break;
      case "date":
        values[field.id] = today;
        break;
      default:
        values[field.id] = "";
    }
    if (hasOther(field)) values[otherKey(field.id)] = "";
  }
  return values as NeedsAnalysisValues;
}

/** Field ids (including "Outro" companions) that belong to a step — used to validate per step. */
export function fieldsOfStep(step: number) {
  return needsAnalysisFields
    .filter((field) => field.step === step)
    .flatMap((field) => (hasOther(field) ? [field.id, otherKey(field.id)] : [field.id]));
}
