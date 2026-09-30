import { needsAnalysisFields, needsAnalysisSteps } from "@content/needs-analysis";
import { findProgram } from "./prefill";
import { otherKey, type NeedsAnalysisValues } from "./schema";

export type AnswerRow = { step: string; question: string; answer: string };

const withOther = (value: string, other: unknown) =>
  value === "Outro" && typeof other === "string" && other.trim() ? `Outro: ${other.trim()}` : value;

/** Human-readable answers, in form order — used for the e-mail to the school. */
export function formatAnswers(values: NeedsAnalysisValues): AnswerRow[] {
  const data = values as Record<string, unknown>;
  return needsAnalysisFields.map((field) => {
    const raw = data[field.id];
    const other = data[otherKey(field.id)];
    let answer = "—";
    switch (field.type) {
      case "multiple": {
        const list = (raw as string[] | undefined) ?? [];
        if (list.length) answer = list.map((item) => withOther(item, other)).join(", ");
        break;
      }
      case "grid": {
        const grid = (raw as Record<string, string> | undefined) ?? {};
        const lines = field.rows.filter((row) => grid[row]).map((row) => `${row}: ${grid[row]}`);
        if (lines.length) answer = lines.join("\n");
        break;
      }
      case "schedule": {
        const slots = (raw as string[] | undefined) ?? [];
        if (slots.length) {
          answer = field.days
            .map((day) => {
              const times = slots
                .filter((slot) => slot.startsWith(`${day} `))
                .map((slot) => slot.slice(day.length + 1));
              return times.length ? `${day}: ${times.join(", ")}` : null;
            })
            .filter(Boolean)
            .join("\n");
        }
        break;
      }
      default:
        if (typeof raw === "string" && raw.trim()) answer = withOther(raw.trim(), other);
    }
    const step = needsAnalysisSteps.find((item) => item.step === field.step)?.title ?? "";
    return { step, question: field.label, answer };
  });
}

/** Where the lead came from (CTA context) — shown at the top of the e-mail. */
export function describeContext(values: NeedsAnalysisValues) {
  const context = values.context ?? {};
  const program = findProgram(context);
  const parts = [
    context.perfil === "empresa" ? "Perfil: empresa / RH" : null,
    program ? `Programa escolhido no site: ${program.name}` : null,
    context.idioma ? `Página de idioma: ${context.idioma}` : null,
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : "Acesso direto ao formulário";
}

const escape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Simple, e-mail-client-safe HTML table. */
export function answersToHtml(values: NeedsAnalysisValues) {
  const rows = formatAnswers(values);
  let lastStep = "";
  const body = rows
    .map((row) => {
      const header =
        row.step !== lastStep
          ? `<tr><td colspan="2" style="padding:18px 0 6px;font:600 13px Arial;color:#4a625a;text-transform:uppercase;letter-spacing:.08em">${escape(row.step)}</td></tr>`
          : "";
      lastStep = row.step;
      return `${header}<tr><td style="padding:6px 12px 6px 0;vertical-align:top;font:13px Arial;color:#4a5b62;width:45%">${escape(row.question)}</td><td style="padding:6px 0;font:14px Arial;color:#111a2e;white-space:pre-line">${escape(row.answer)}</td></tr>`;
    })
    .join("");
  return `<div style="max-width:720px;margin:auto"><h1 style="font:600 20px Georgia;color:#111a2e">Novo levantamento de necessidades</h1><p style="font:13px Arial;color:#4a5b62">${escape(describeContext(values))}</p><table style="width:100%;border-collapse:collapse">${body}</table></div>`;
}

export function answersToText(values: NeedsAnalysisValues) {
  return [
    "Novo levantamento de necessidades",
    describeContext(values),
    "",
    ...formatAnswers(values).map((row) => `${row.question}\n${row.answer}\n`),
  ].join("\n");
}
