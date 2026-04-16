import { logger } from "./logger";

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  console.warn("[Email] RESEND_API_KEY not set — ticket emails will be logged but not sent.");
}

const FROM_ADDRESS = process.env.EMAIL_FROM || "NexFortis Support <onboarding@resend.dev>";

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail(params: SendEmailParams): Promise<boolean> {
  if (!resendApiKey) {
    logger.info({ to: params.to, subject: params.subject }, "[Email] Skipped (no API key)");
    return false;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: params.to,
        subject: params.subject,
        html: params.html,
        ...(params.replyTo ? { reply_to: params.replyTo } : {}),
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      logger.error({ status: response.status, body: errorBody, to: params.to }, "[Email] Resend API error");
      return false;
    }

    const result = (await response.json()) as { id?: string };
    logger.info({ to: params.to, subject: params.subject, id: result.id }, "[Email] Sent successfully");
    return true;
  } catch (err) {
    logger.error({ err, to: params.to }, "[Email] Failed to send");
    return false;
  }
}
