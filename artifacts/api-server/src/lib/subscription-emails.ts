import { logger } from "./logger";
import { getTierConfig, type SubscriptionTier } from "./subscription-config";

const RESEND_API_URL = "https://api.resend.com/emails";
const FROM_ADDRESS = "NexFortis <onboarding@resend.dev>";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const BRAND = {
  navy: "#1e3a5f",
  navyDark: "#152b47",
  roseGold: "#b76e79",
  roseGoldLight: "#d4a5ad",
  white: "#ffffff",
  grayLight: "#f4f4f6",
  grayText: "#6b7280",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)} CAD`;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function baseLayout(title: string, content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${title}</title></head>
<body style="margin:0;padding:0;background-color:${BRAND.grayLight};font-family:${BRAND.fontFamily};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.grayLight};padding:32px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:${BRAND.white};border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,${BRAND.navy},${BRAND.navyDark});padding:32px 40px;text-align:center;">
            <h1 style="margin:0;color:${BRAND.roseGoldLight};font-size:24px;font-weight:700;letter-spacing:0.5px;">NexFortis</h1>
            <p style="margin:4px 0 0;color:${BRAND.white};font-size:13px;opacity:0.8;">IT Solutions &amp; QuickBooks Services</p>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px;">
            ${content}
          </td>
        </tr>
        <tr>
          <td style="background-color:${BRAND.grayLight};padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
            <p style="margin:0;font-size:12px;color:${BRAND.grayText};">&copy; ${new Date().getFullYear()} NexFortis IT Solutions. All rights reserved.</p>
            <p style="margin:4px 0 0;font-size:12px;color:${BRAND.grayText};">Questions? Contact us at <a href="mailto:contact@nexfortis.com" style="color:${BRAND.roseGold};">contact@nexfortis.com</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function tierBadge(tier: string): string {
  return `<span style="display:inline-block;background-color:${BRAND.roseGold};color:${BRAND.white};padding:4px 14px;border-radius:20px;font-size:13px;font-weight:600;letter-spacing:0.5px;">${capitalize(tier)}</span>`;
}

function tierDetailsTable(tier: SubscriptionTier): string {
  const config = getTierConfig(tier);
  const ticketLabel = config.ticketLimit === -1 ? "Unlimited" : `${config.ticketLimit} per month`;
  const slaLabel = `${config.slaMinutes} minutes`;
  const discountLabel = config.discountPercent > 0 ? `${config.discountPercent}%` : "—";

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;">
    <tr style="background-color:${BRAND.grayLight};">
      <td style="padding:10px 16px;font-size:13px;font-weight:600;color:${BRAND.navy};border-bottom:1px solid #e5e7eb;">Feature</td>
      <td style="padding:10px 16px;font-size:13px;font-weight:600;color:${BRAND.navy};border-bottom:1px solid #e5e7eb;">Your Plan</td>
    </tr>
    <tr>
      <td style="padding:10px 16px;font-size:13px;color:${BRAND.grayText};border-bottom:1px solid #f0f0f0;">Support Tickets</td>
      <td style="padding:10px 16px;font-size:13px;color:#111;">${ticketLabel}</td>
    </tr>
    <tr>
      <td style="padding:10px 16px;font-size:13px;color:${BRAND.grayText};border-bottom:1px solid #f0f0f0;">SLA Response Time</td>
      <td style="padding:10px 16px;font-size:13px;color:#111;">${slaLabel}</td>
    </tr>
    <tr>
      <td style="padding:10px 16px;font-size:13px;color:${BRAND.grayText};">Service Discount</td>
      <td style="padding:10px 16px;font-size:13px;color:#111;">${discountLabel}</td>
    </tr>
  </table>`;
}

function welcomeEmailHtml(name: string, tier: SubscriptionTier): string {
  const config = getTierConfig(tier);
  return baseLayout("Welcome to NexFortis", `
    <h2 style="margin:0 0 8px;color:${BRAND.navy};font-size:20px;">Welcome aboard, ${escapeHtml(name)}!</h2>
    <p style="margin:0 0 16px;color:${BRAND.grayText};font-size:14px;line-height:1.6;">
      Your <strong>${capitalize(tier)}</strong> subscription is now active. We're excited to have you as part of the NexFortis family.
    </p>
    <div style="text-align:center;margin:20px 0;">${tierBadge(tier)}</div>
    <p style="margin:0 0 8px;color:${BRAND.navy};font-size:15px;font-weight:600;">Your plan includes:</p>
    ${tierDetailsTable(tier)}
    <p style="margin:16px 0 0;color:${BRAND.grayText};font-size:14px;line-height:1.6;">
      Monthly rate: <strong>${formatPrice(config.launchPriceCad)}</strong>
    </p>
    <div style="text-align:center;margin:28px 0 8px;">
      <a href="https://nexfortis.com/qb-portal/subscription" style="display:inline-block;background-color:${BRAND.roseGold};color:${BRAND.white};padding:12px 32px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;">View Your Subscription</a>
    </div>
  `);
}

function upgradeEmailHtml(name: string, oldTier: SubscriptionTier, newTier: SubscriptionTier): string {
  return baseLayout("Subscription Upgraded", `
    <h2 style="margin:0 0 8px;color:${BRAND.navy};font-size:20px;">Upgrade confirmed, ${escapeHtml(name)}!</h2>
    <p style="margin:0 0 16px;color:${BRAND.grayText};font-size:14px;line-height:1.6;">
      Your subscription has been upgraded from <strong>${capitalize(oldTier)}</strong> to <strong>${capitalize(newTier)}</strong>. Your new benefits are available immediately.
    </p>
    <div style="text-align:center;margin:20px 0;">
      <span style="color:${BRAND.grayText};font-size:13px;">${capitalize(oldTier)}</span>
      <span style="display:inline-block;margin:0 12px;color:${BRAND.roseGold};font-size:18px;">&#8594;</span>
      ${tierBadge(newTier)}
    </div>
    <p style="margin:16px 0 8px;color:${BRAND.navy};font-size:15px;font-weight:600;">Your upgraded plan:</p>
    ${tierDetailsTable(newTier)}
    <p style="margin:16px 0 0;color:${BRAND.grayText};font-size:13px;line-height:1.6;">
      A prorated charge will appear on your next invoice to reflect the plan change.
    </p>
    <div style="text-align:center;margin:28px 0 8px;">
      <a href="https://nexfortis.com/qb-portal/subscription" style="display:inline-block;background-color:${BRAND.roseGold};color:${BRAND.white};padding:12px 32px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;">View Your Subscription</a>
    </div>
  `);
}

function downgradeEmailHtml(name: string, oldTier: SubscriptionTier, newTier: SubscriptionTier, effectiveDate: string): string {
  return baseLayout("Downgrade Scheduled", `
    <h2 style="margin:0 0 8px;color:${BRAND.navy};font-size:20px;">Downgrade scheduled, ${escapeHtml(name)}</h2>
    <p style="margin:0 0 16px;color:${BRAND.grayText};font-size:14px;line-height:1.6;">
      Your subscription will change from <strong>${capitalize(oldTier)}</strong> to <strong>${capitalize(newTier)}</strong> at the end of your current billing period.
    </p>
    <div style="text-align:center;margin:20px 0;">
      <span style="color:${BRAND.grayText};font-size:13px;">${capitalize(oldTier)}</span>
      <span style="display:inline-block;margin:0 12px;color:${BRAND.grayText};font-size:18px;">&#8594;</span>
      ${tierBadge(newTier)}
    </div>
    <div style="background-color:#fffbeb;border:1px solid #fbbf24;border-radius:6px;padding:14px 18px;margin:20px 0;">
      <p style="margin:0;font-size:13px;color:#92400e;font-weight:600;">Effective Date: ${effectiveDate}</p>
      <p style="margin:6px 0 0;font-size:13px;color:#92400e;">You'll keep your current ${capitalize(oldTier)} benefits until this date.</p>
    </div>
    <p style="margin:16px 0 8px;color:${BRAND.navy};font-size:15px;font-weight:600;">Your new plan (starting ${effectiveDate}):</p>
    ${tierDetailsTable(newTier)}
    <div style="text-align:center;margin:28px 0 8px;">
      <a href="https://nexfortis.com/qb-portal/subscription" style="display:inline-block;background-color:${BRAND.roseGold};color:${BRAND.white};padding:12px 32px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;">Manage Subscription</a>
    </div>
  `);
}

function cancellationEmailHtml(name: string, tier: SubscriptionTier, endDate: string): string {
  return baseLayout("Subscription Cancellation Confirmed", `
    <h2 style="margin:0 0 8px;color:${BRAND.navy};font-size:20px;">We're sorry to see you go, ${escapeHtml(name)}</h2>
    <p style="margin:0 0 16px;color:${BRAND.grayText};font-size:14px;line-height:1.6;">
      Your <strong>${capitalize(tier)}</strong> subscription has been set to cancel. You'll continue to have full access to your plan benefits until the end of your current billing period.
    </p>
    <div style="background-color:#fef2f2;border:1px solid #fca5a5;border-radius:6px;padding:14px 18px;margin:20px 0;">
      <p style="margin:0;font-size:13px;color:#991b1b;font-weight:600;">Access ends: ${endDate}</p>
      <p style="margin:6px 0 0;font-size:13px;color:#991b1b;">Your subscription will not renew after this date.</p>
    </div>
    <p style="margin:16px 0 0;color:${BRAND.grayText};font-size:14px;line-height:1.6;">
      Changed your mind? You can reactivate your subscription at any time before <strong>${endDate}</strong> to keep your current plan.
    </p>
    <div style="text-align:center;margin:28px 0 8px;">
      <a href="https://nexfortis.com/qb-portal/subscription" style="display:inline-block;background-color:${BRAND.roseGold};color:${BRAND.white};padding:12px 32px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;">Reactivate Subscription</a>
    </div>
  `);
}

function paymentFailedEmailHtml(name: string, tier: SubscriptionTier): string {
  return baseLayout("Payment Failed — Action Required", `
    <h2 style="margin:0 0 8px;color:${BRAND.navy};font-size:20px;">Payment issue detected, ${escapeHtml(name)}</h2>
    <p style="margin:0 0 16px;color:${BRAND.grayText};font-size:14px;line-height:1.6;">
      We were unable to process the latest payment for your <strong>${capitalize(tier)}</strong> subscription. Don't worry — we'll automatically retry the charge, but please update your payment method if needed.
    </p>
    <div style="background-color:#fef2f2;border:1px solid #fca5a5;border-radius:6px;padding:14px 18px;margin:20px 0;">
      <p style="margin:0;font-size:13px;color:#991b1b;font-weight:600;">&#9888; Your subscription is at risk</p>
      <p style="margin:6px 0 0;font-size:13px;color:#991b1b;">If we can't collect payment, your subscription may be suspended.</p>
    </div>
    <p style="margin:16px 0 8px;color:${BRAND.navy};font-size:15px;font-weight:600;">What you can do:</p>
    <ol style="margin:0 0 16px;padding-left:20px;color:${BRAND.grayText};font-size:14px;line-height:1.8;">
      <li>Check that your card details are up to date</li>
      <li>Ensure sufficient funds are available</li>
      <li>Contact your bank if the card was declined</li>
    </ol>
    <p style="margin:0 0 0;color:${BRAND.grayText};font-size:14px;line-height:1.6;">
      If you need help, reach out to us at <a href="mailto:contact@nexfortis.com" style="color:${BRAND.roseGold};">contact@nexfortis.com</a>.
    </p>
    <div style="text-align:center;margin:28px 0 8px;">
      <a href="https://nexfortis.com/qb-portal/subscription" style="display:inline-block;background-color:${BRAND.roseGold};color:${BRAND.white};padding:12px 32px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;">Update Payment Method</a>
    </div>
  `);
}

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    logger.warn({ to, subject }, "Subscription email skipped — RESEND_API_KEY not set");
    return false;
  }

  try {
    const response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ from: FROM_ADDRESS, to, subject, html }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      logger.error({ status: response.status, body: errorBody, to, subject }, "Resend API error for subscription email");
      return false;
    }

    logger.info({ to, subject }, "Subscription email sent");
    return true;
  } catch (err) {
    logger.error({ err, to, subject }, "Failed to send subscription email");
    return false;
  }
}

export async function sendWelcomeEmail(email: string, name: string, tier: SubscriptionTier): Promise<boolean> {
  const subject = `Welcome to NexFortis ${capitalize(tier)} — Your subscription is active!`;
  return sendEmail(email, subject, welcomeEmailHtml(name || "there", tier));
}

export async function sendUpgradeEmail(email: string, name: string, oldTier: SubscriptionTier, newTier: SubscriptionTier): Promise<boolean> {
  const subject = `Subscription upgraded to ${capitalize(newTier)}`;
  return sendEmail(email, subject, upgradeEmailHtml(name || "there", oldTier, newTier));
}

export async function sendDowngradeEmail(email: string, name: string, oldTier: SubscriptionTier, newTier: SubscriptionTier, effectiveDate: Date): Promise<boolean> {
  const dateStr = effectiveDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const subject = `Downgrade to ${capitalize(newTier)} scheduled for ${dateStr}`;
  return sendEmail(email, subject, downgradeEmailHtml(name || "there", oldTier, newTier, dateStr));
}

export async function sendCancellationEmail(email: string, name: string, tier: SubscriptionTier, endDate: Date): Promise<boolean> {
  const dateStr = endDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const subject = "Your NexFortis subscription cancellation is confirmed";
  return sendEmail(email, subject, cancellationEmailHtml(name || "there", tier, dateStr));
}

export async function sendPaymentFailedEmail(email: string, name: string, tier: SubscriptionTier): Promise<boolean> {
  const subject = "Action required: Payment failed for your NexFortis subscription";
  return sendEmail(email, subject, paymentFailedEmailHtml(name || "there", tier));
}
