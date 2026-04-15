import { Router, type Request, type Response } from "express";
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

contactRouter.post("/", async (req: Request, res: Response) => {
  try {
    const rawBody = req.body as ContactBody;
    const name = rawBody.name ? sanitizeInput(rawBody.name) : undefined;
    const email = rawBody.email ? sanitizeInput(rawBody.email) : undefined;
    const phone = rawBody.phone;
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
      const escapeHtml = (str: string) =>
        str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "NexFortis Contact Form <onboarding@resend.dev>",
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
    } else {
      logger.info(
        { name, email, phone, company, service, message },
        "Contact form submitted (no email service configured — RESEND_API_KEY not set)"
      );
    }

    res.json({ success: true, message: "Your message has been received. We'll be in touch within 24 business hours." });
  } catch (error) {
    logger.error(error, "Contact form submission failed");
    res.status(500).json({ error: "Failed to process your message. Please try again or email us directly at contact@nexfortis.com." });
  }
});

export default contactRouter;
