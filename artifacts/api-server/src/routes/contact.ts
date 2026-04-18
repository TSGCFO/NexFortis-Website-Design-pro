import { Router, type Request, type Response } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { logger } from "../lib/logger";
import sanitizeHtml from "sanitize-html";

interface ContactBody {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  service?: string;
  message?: string;
}

function sanitizeInput(input: string): string {
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
}

function validateContact(body: ContactBody): string | null {
  if (!body.name || body.name.length < 2) return "Name must be at least 2 characters.";
  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) return "Please enter a valid email address.";
  if (!body.phone || body.phone.length < 10) return "Please enter a valid phone number.";
  if (!body.service || body.service.length < 1) return "Please select a service.";
  if (!body.message || body.message.length < 10) return "Message must be at least 10 characters.";
  return null;
}

const contactRouter = Router();

function getClientIp(req: any): string {
  // app.set("trust proxy", 1) makes req.ip the real client IP from the
  // first untrusted hop. Use req.ip rather than the raw X-Forwarded-For
  // header to avoid client-controlled spoofing of the rate-limit key.
  return req.ip || req.socket?.remoteAddress || "unknown";
}

const contactSubmitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 3,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(getClientIp(req)),
  message: { error: "Too many submissions. Please try again later." },
});

const escapeHtml = (str: string) =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

async function sendAcknowledgement(
  resendApiKey: string,
  name: string,
  email: string,
  service: string,
  message: string,
): Promise<void> {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; color: #1a1a2e;">
      <div style="background: #1a1a2e; padding: 24px 32px;">
        <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700;">NexFortis IT Solutions</h1>
      </div>
      <div style="padding: 32px;">
        <h2 style="color: #1a1a2e; margin: 0 0 16px; font-size: 20px;">Thanks for reaching out, ${escapeHtml(name)}!</h2>
        <p style="color: #4a4a5e; line-height: 1.6; margin: 0 0 16px;">
          We've received your message and a member of our team will be in touch <strong>within 1&ndash;2 business hours</strong>.
        </p>
        <p style="color: #4a4a5e; line-height: 1.6; margin: 0 0 24px;">
          Here's a copy of what you sent us:
        </p>
        <div style="background: #f7f7fa; border-left: 4px solid #c9a96e; padding: 16px 20px; margin: 0 0 24px; border-radius: 6px;">
          <p style="margin: 0 0 8px; color: #1a1a2e;"><strong>Service:</strong> ${escapeHtml(service)}</p>
          <p style="margin: 0; color: #4a4a5e; white-space: pre-wrap; line-height: 1.6;">${escapeHtml(message)}</p>
        </div>
        <p style="color: #4a4a5e; line-height: 1.6; margin: 0 0 8px;">
          If you need immediate assistance, you can reach us at
          <a href="mailto:contact@nexfortis.com" style="color: #c9a96e; text-decoration: none;">contact@nexfortis.com</a>.
        </p>
      </div>
      <div style="background: #f7f7fa; padding: 20px 32px; text-align: center; color: #6a6a7e; font-size: 12px; border-top: 1px solid #e5e5ec;">
        <p style="margin: 0 0 4px;">NexFortis IT Solutions &mdash; 204 Hill Farm Rd, Nobleton, ON L7B 0A1</p>
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} 17756968 Canada Inc. All rights reserved.</p>
      </div>
    </div>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendApiKey}`,
    },
    body: JSON.stringify({
      from: "NexFortis <noreply@nexfortis.com>",
      to: email,
      subject: "We've received your message — NexFortis IT Solutions",
      html,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend ack failed: ${response.status} ${body}`);
  }
}

contactRouter.post("/", contactSubmitLimiter, async (req: Request, res: Response) => {
  try {
    const rawBody = req.body as ContactBody;
    const name = rawBody.name ? sanitizeInput(rawBody.name) : undefined;
    const email = rawBody.email ? sanitizeInput(rawBody.email) : undefined;
    const phone = rawBody.phone ? sanitizeInput(rawBody.phone) : undefined;
    const company = rawBody.company ? sanitizeInput(rawBody.company) : undefined;
    const service = rawBody.service ? sanitizeInput(rawBody.service) : undefined;
    const message = rawBody.message ? sanitizeInput(rawBody.message) : undefined;

    const error = validateContact({ name, email, phone, company, service, message });
    if (error) {
      res.status(400).json({ error });
      return;
    }

    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "NexFortis <noreply@nexfortis.com>",
          to: "contact@nexfortis.com",
          subject: `New Contact Form Submission from ${escapeHtml(name!)}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${escapeHtml(name!)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email!)}</p>
            <p><strong>Phone:</strong> ${escapeHtml(phone!)}</p>
            <p><strong>Company:</strong> ${escapeHtml(company || "Not provided")}</p>
            <p><strong>Service:</strong> ${escapeHtml(service!)}</p>
            <p><strong>Message:</strong></p>
            <p>${escapeHtml(message!)}</p>
          `,
          reply_to: email,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        logger.error({ status: response.status, body: errorBody }, "Resend API error");
        throw new Error("Email delivery failed");
      }

      logger.info({ name, email, service }, "Contact form submitted and email sent via Resend");

      try {
        await sendAcknowledgement(resendApiKey, name!, email!, service!, message!);
        logger.info({ email }, "Acknowledgement email sent to submitter");
      } catch (ackErr) {
        logger.error(ackErr, "Acknowledgement email failed (non-fatal)");
      }
    } else {
      logger.info(
        { name, email, phone, company, service, message },
        "Contact form submitted (no email service configured — RESEND_API_KEY not set)"
      );
    }

    res.json({ success: true, message: "Your message has been received. We'll be in touch within 1–2 business hours." });
  } catch (error) {
    logger.error(error, "Contact form submission failed");
    res.status(500).json({ error: "Failed to process your message. Please try again or email us directly at contact@nexfortis.com." });
  }
});

export default contactRouter;
