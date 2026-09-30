import { Resend } from "resend";

export type EmailMessage = {
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

export type EmailResult =
  | { status: "sent"; id: string }
  /** Development without RESEND_API_KEY: logged to the terminal instead of sent. */
  | { status: "simulated" }
  /** Production without RESEND_API_KEY: must be reported to the visitor, never faked. */
  | { status: "not-configured" }
  | { status: "failed"; error: string };

/**
 * Sends a message to the school's inbox (CONTACT_EMAIL_TO) through Resend.
 * Server-only: reads secrets from the environment.
 */
export async function sendToSchool(message: EmailMessage): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL_TO;
  const from = process.env.CONTACT_EMAIL_FROM ?? "Mundi Languages <onboarding@resend.dev>";

  if (!apiKey || !to) {
    if (process.env.NODE_ENV !== "production") {
      console.info(
        `\n[email simulado — defina RESEND_API_KEY e CONTACT_EMAIL_TO]\n${message.subject}\n${message.text}\n`,
      );
      return { status: "simulated" };
    }
    console.error("[email] RESEND_API_KEY / CONTACT_EMAIL_TO not configured — message not sent");
    return { status: "not-configured" };
  }

  try {
    const { data, error } = await new Resend(apiKey).emails.send({
      from,
      to: to.split(",").map((address) => address.trim()),
      subject: message.subject,
      html: message.html,
      text: message.text,
      replyTo: message.replyTo,
    });
    if (error || !data) return { status: "failed", error: error?.message ?? "unknown error" };
    console.info(`[email] sent id=${data.id} subject="${message.subject}"`);
    return { status: "sent", id: data.id };
  } catch (error) {
    return { status: "failed", error: error instanceof Error ? error.message : String(error) };
  }
}
