import { sendToSchool } from "@/lib/email";
import { answersToHtml, answersToText } from "@/lib/needs-analysis/format";
import { needsAnalysisSchema, type NeedsAnalysisValues } from "@/lib/needs-analysis/schema";
import { clientIp, rateLimit } from "@/lib/rate-limit";

/**
 * Receives the native "Levantamento de Necessidades" form (spec §5.4) and e-mails it to the
 * school. Validation is the same Zod schema used in the browser.
 */
export async function POST(request: Request) {
  const limit = rateLimit(`needs-analysis:${clientIp(request)}`);
  if (!limit.allowed) {
    return Response.json(
      { ok: false, error: "rate-limited" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter ?? 600) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid-json" }, { status: 400 });
  }

  const parsed = needsAnalysisSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      {
        ok: false,
        error: "invalid",
        fields: parsed.error.issues.map((issue) => issue.path.join(".")),
      },
      { status: 422 },
    );
  }

  const values = parsed.data as NeedsAnalysisValues;
  // Honeypot filled → a bot. Pretend success so it does not retry.
  if (values.hp_check) {
    console.warn("[needs-analysis] honeypot filled — discarded as bot");
    return Response.json({ ok: true });
  }

  const name = String(values.name ?? "").trim();
  const result = await sendToSchool({
    subject: `Levantamento de Necessidades — ${name}`,
    html: answersToHtml(values),
    text: answersToText(values),
    replyTo: String(values.email ?? ""),
  });

  switch (result.status) {
    case "sent":
    case "simulated":
      return Response.json({ ok: true, delivery: result.status });
    case "not-configured":
      return Response.json({ ok: false, error: "email-not-configured" }, { status: 503 });
    case "failed":
      console.error("[needs-analysis] e-mail failed:", result.error);
      return Response.json({ ok: false, error: "email-failed" }, { status: 502 });
  }
}
