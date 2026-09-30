import { contactSchema } from "@/lib/contact/schema";
import { sendToSchool } from "@/lib/email";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const escape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Short contact form of /contato/ → e-mail to the school. */
export async function POST(request: Request) {
  const limit = rateLimit(`contact:${clientIp(request)}`);
  if (!limit.allowed) {
    return Response.json(
      { ok: false, error: "rate-limited" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter ?? 600) } },
    );
  }

  const parsed = contactSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ ok: false, error: "invalid" }, { status: 422 });

  const values = parsed.data;
  if (values.hp_check) {
    console.warn("[contact] honeypot filled — discarded as bot");
    return Response.json({ ok: true });
  }

  const rows: [string, string][] = [
    ["Nome", values.name],
    ["E-mail", values.email],
    ["WhatsApp", values.whatsapp || "—"],
    ["Perfil", values.profile],
    ["Mensagem", values.message],
  ];
  const result = await sendToSchool({
    subject: `Contato pelo site — ${values.name} (${values.profile})`,
    replyTo: values.email,
    text: rows.map(([label, value]) => `${label}: ${value}`).join("\n"),
    html: `<table style="font:14px Arial;color:#111a2e">${rows
      .map(
        ([label, value]) =>
          `<tr><td style="padding:6px 16px 6px 0;color:#4a5b62;vertical-align:top">${label}</td><td style="padding:6px 0;white-space:pre-line">${escape(value)}</td></tr>`,
      )
      .join("")}</table>`,
  });

  if (result.status === "sent" || result.status === "simulated") {
    return Response.json({ ok: true, delivery: result.status });
  }
  if (result.status === "failed") console.error("[contact] e-mail failed:", result.error);
  return Response.json(
    {
      ok: false,
      error: result.status === "not-configured" ? "email-not-configured" : "email-failed",
    },
    { status: result.status === "not-configured" ? 503 : 502 },
  );
}
