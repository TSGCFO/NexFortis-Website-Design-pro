const BRAND_COLORS = {
  navy: "#0a1628",
  azure: "#2563eb",
  roseGold: "#e8a87c",
  white: "#ffffff",
  gray: "#f3f4f6",
  textDark: "#1f2937",
  textMuted: "#6b7280",
};

function baseLayout(content: string, unsubscribeUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:${BRAND_COLORS.gray};font-family:'Inter',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND_COLORS.gray};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <tr>
            <td style="background-color:${BRAND_COLORS.navy};padding:24px 32px;border-radius:12px 12px 0 0;text-align:center;">
              <h1 style="margin:0;font-size:24px;font-weight:700;color:${BRAND_COLORS.white};letter-spacing:0.5px;">
                Nex<span style="color:${BRAND_COLORS.roseGold};">Fortis</span>
              </h1>
              <p style="margin:4px 0 0;font-size:12px;color:${BRAND_COLORS.textMuted};letter-spacing:1px;text-transform:uppercase;">
                IT Solutions
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:${BRAND_COLORS.white};padding:32px;border-radius:0 0 12px 12px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px;text-align:center;">
              <p style="margin:0 0 8px;font-size:12px;color:${BRAND_COLORS.textMuted};">
                NexFortis IT Solutions &bull; QuickBooks Support Portal
              </p>
              <p style="margin:0;font-size:12px;">
                <a href="${unsubscribeUrl}" style="color:${BRAND_COLORS.textMuted};text-decoration:underline;">
                  Manage notification preferences
                </a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function badge(text: string, bgColor: string, textColor: string): string {
  return `<span style="display:inline-block;padding:4px 12px;border-radius:9999px;font-size:12px;font-weight:600;background-color:${bgColor};color:${textColor};">${text}</span>`;
}

export function ticketCreatedEmail(
  customerName: string,
  ticketId: number,
  subject: string,
  slaDeadline: string,
  isCritical: boolean,
  portalUrl: string,
  unsubscribeUrl: string,
): { subject: string; html: string } {
  const criticalBadge = isCritical ? ` ${badge("CRITICAL", "#fef2f2", "#dc2626")}` : "";
  const deadlineDate = new Date(slaDeadline);
  const slaFormatted = deadlineDate.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });

  const content = `
    <h2 style="margin:0 0 16px;font-size:20px;color:${BRAND_COLORS.textDark};">
      Ticket Received ${criticalBadge}
    </h2>
    <p style="margin:0 0 16px;font-size:15px;color:${BRAND_COLORS.textDark};line-height:1.6;">
      Hi ${escapeHtml(customerName)},
    </p>
    <p style="margin:0 0 24px;font-size:15px;color:${BRAND_COLORS.textDark};line-height:1.6;">
      We've received your support ticket and our team will be reviewing it shortly.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND_COLORS.gray};border-radius:8px;padding:16px;margin-bottom:24px;">
      <tr>
        <td>
          <p style="margin:0 0 8px;font-size:13px;color:${BRAND_COLORS.textMuted};text-transform:uppercase;letter-spacing:0.5px;">Ticket #${ticketId}</p>
          <p style="margin:0 0 12px;font-size:16px;font-weight:600;color:${BRAND_COLORS.textDark};">${escapeHtml(subject)}</p>
          <p style="margin:0;font-size:13px;color:${BRAND_COLORS.textMuted};">
            <strong>SLA Response Deadline:</strong> ${slaFormatted}
          </p>
        </td>
      </tr>
    </table>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
      <tr>
        <td style="background-color:${BRAND_COLORS.azure};border-radius:8px;">
          <a href="${portalUrl}/support" style="display:inline-block;padding:12px 32px;font-size:15px;font-weight:600;color:${BRAND_COLORS.white};text-decoration:none;">
            View Ticket
          </a>
        </td>
      </tr>
    </table>`;

  return {
    subject: `[Ticket #${ticketId}] ${subject}`,
    html: baseLayout(content, unsubscribeUrl),
  };
}

export function operatorRepliedEmail(
  customerName: string,
  ticketId: number,
  subject: string,
  replyPreview: string,
  portalUrl: string,
  unsubscribeUrl: string,
): { subject: string; html: string } {
  const content = `
    <h2 style="margin:0 0 16px;font-size:20px;color:${BRAND_COLORS.textDark};">
      New Reply on Your Ticket
    </h2>
    <p style="margin:0 0 16px;font-size:15px;color:${BRAND_COLORS.textDark};line-height:1.6;">
      Hi ${escapeHtml(customerName)},
    </p>
    <p style="margin:0 0 24px;font-size:15px;color:${BRAND_COLORS.textDark};line-height:1.6;">
      Our support team has replied to your ticket.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND_COLORS.gray};border-radius:8px;padding:16px;margin-bottom:16px;">
      <tr>
        <td>
          <p style="margin:0 0 8px;font-size:13px;color:${BRAND_COLORS.textMuted};text-transform:uppercase;letter-spacing:0.5px;">Ticket #${ticketId}</p>
          <p style="margin:0 0 12px;font-size:16px;font-weight:600;color:${BRAND_COLORS.textDark};">${escapeHtml(subject)}</p>
        </td>
      </tr>
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-left:3px solid ${BRAND_COLORS.azure};padding-left:16px;margin-bottom:24px;">
      <tr>
        <td>
          <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:${BRAND_COLORS.azure};">NexFortis Support</p>
          <p style="margin:0;font-size:14px;color:${BRAND_COLORS.textDark};line-height:1.6;">${escapeHtml(replyPreview)}${replyPreview.length >= 200 ? "…" : ""}</p>
        </td>
      </tr>
    </table>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
      <tr>
        <td style="background-color:${BRAND_COLORS.azure};border-radius:8px;">
          <a href="${portalUrl}/support" style="display:inline-block;padding:12px 32px;font-size:15px;font-weight:600;color:${BRAND_COLORS.white};text-decoration:none;">
            View & Reply
          </a>
        </td>
      </tr>
    </table>`;

  return {
    subject: `Re: [Ticket #${ticketId}] ${subject}`,
    html: baseLayout(content, unsubscribeUrl),
  };
}

export function ticketResolvedEmail(
  customerName: string,
  ticketId: number,
  subject: string,
  portalUrl: string,
  unsubscribeUrl: string,
): { subject: string; html: string } {
  const content = `
    <h2 style="margin:0 0 16px;font-size:20px;color:${BRAND_COLORS.textDark};">
      Ticket Resolved ${badge("RESOLVED", "#ecfdf5", "#059669")}
    </h2>
    <p style="margin:0 0 16px;font-size:15px;color:${BRAND_COLORS.textDark};line-height:1.6;">
      Hi ${escapeHtml(customerName)},
    </p>
    <p style="margin:0 0 24px;font-size:15px;color:${BRAND_COLORS.textDark};line-height:1.6;">
      Your support ticket has been marked as resolved. If you have any further questions or the issue persists, you can reopen the ticket by posting a reply.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND_COLORS.gray};border-radius:8px;padding:16px;margin-bottom:24px;">
      <tr>
        <td>
          <p style="margin:0 0 8px;font-size:13px;color:${BRAND_COLORS.textMuted};text-transform:uppercase;letter-spacing:0.5px;">Ticket #${ticketId}</p>
          <p style="margin:0;font-size:16px;font-weight:600;color:${BRAND_COLORS.textDark};">${escapeHtml(subject)}</p>
        </td>
      </tr>
    </table>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
      <tr>
        <td style="background-color:${BRAND_COLORS.azure};border-radius:8px;">
          <a href="${portalUrl}/support" style="display:inline-block;padding:12px 32px;font-size:15px;font-weight:600;color:${BRAND_COLORS.white};text-decoration:none;">
            View Ticket
          </a>
        </td>
      </tr>
    </table>`;

  return {
    subject: `[Resolved] [Ticket #${ticketId}] ${subject}`,
    html: baseLayout(content, unsubscribeUrl),
  };
}

export function freeOrderCustomerEmail(
  customerName: string,
  orderId: number,
  serviceName: string,
  promoCode: string,
  portalUrl: string,
  unsubscribeUrl: string,
): { subject: string; html: string } {
  const content = `
    <h2 style="margin:0 0 16px;font-size:20px;color:${BRAND_COLORS.textDark};">
      Order Confirmed ${badge("FREE", "#ecfdf5", "#059669")}
    </h2>
    <p style="margin:0 0 16px;font-size:15px;color:${BRAND_COLORS.textDark};line-height:1.6;">
      Hi ${escapeHtml(customerName)},
    </p>
    <p style="margin:0 0 24px;font-size:15px;color:${BRAND_COLORS.textDark};line-height:1.6;">
      Your order has been confirmed using promo code <strong>${escapeHtml(promoCode)}</strong>. No payment was charged.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND_COLORS.gray};border-radius:8px;padding:16px;margin-bottom:24px;">
      <tr>
        <td>
          <p style="margin:0 0 8px;font-size:13px;color:${BRAND_COLORS.textMuted};text-transform:uppercase;letter-spacing:0.5px;">Order #${orderId}</p>
          <p style="margin:0 0 8px;font-size:16px;font-weight:600;color:${BRAND_COLORS.textDark};">${escapeHtml(serviceName)}</p>
          <p style="margin:0;font-size:14px;color:${BRAND_COLORS.textDark};"><strong>Total charged:</strong> $0.00 CAD</p>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 16px;font-size:14px;color:${BRAND_COLORS.textDark};line-height:1.6;">
      Next steps: please log in to your portal to upload any required files and track your order status.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
      <tr>
        <td style="background-color:${BRAND_COLORS.azure};border-radius:8px;">
          <a href="${portalUrl}" style="display:inline-block;padding:12px 32px;font-size:15px;font-weight:600;color:${BRAND_COLORS.white};text-decoration:none;">
            View Order
          </a>
        </td>
      </tr>
    </table>`;

  return {
    subject: `Order Confirmed — ${serviceName}`,
    html: baseLayout(content, unsubscribeUrl),
  };
}

export function freeOrderOperatorEmail(
  orderId: number,
  serviceName: string,
  promoCode: string,
  customerName: string,
  customerEmail: string,
): { subject: string; html: string } {
  const content = `
    <h2 style="margin:0 0 16px;font-size:20px;color:${BRAND_COLORS.textDark};">
      New Free Promo Order
    </h2>
    <p style="margin:0 0 16px;font-size:14px;color:${BRAND_COLORS.textDark};line-height:1.6;">
      A new order was completed at $0.00 via promo code.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND_COLORS.gray};border-radius:8px;padding:16px;margin-bottom:16px;">
      <tr>
        <td>
          <p style="margin:0 0 8px;font-size:13px;color:${BRAND_COLORS.textMuted};text-transform:uppercase;letter-spacing:0.5px;">Order #${orderId}</p>
          <p style="margin:0 0 4px;font-size:15px;color:${BRAND_COLORS.textDark};"><strong>Service:</strong> ${escapeHtml(serviceName)}</p>
          <p style="margin:0 0 4px;font-size:15px;color:${BRAND_COLORS.textDark};"><strong>Customer:</strong> ${escapeHtml(customerName)} (${escapeHtml(customerEmail)})</p>
          <p style="margin:0;font-size:15px;color:${BRAND_COLORS.textDark};"><strong>Promo:</strong> ${escapeHtml(promoCode)}</p>
        </td>
      </tr>
    </table>
    <p style="margin:0;font-size:13px;color:${BRAND_COLORS.textMuted};font-style:italic;">
      Order fulfilled via promo code — no payment collected.
    </p>`;

  return {
    subject: `New Free Promo Order — #${orderId}`,
    html: baseLayout(content, "#"),
  };
}

export function referralCreditEarnedEmail(
  subscriberName: string,
  creditAmountCents: number,
  totalCreditsCents: number,
  portalUrl: string,
  unsubscribeUrl: string,
): { subject: string; html: string } {
  const amount = `$${(creditAmountCents / 100).toFixed(2)}`;
  const total = `$${(totalCreditsCents / 100).toFixed(2)}`;
  const content = `
    <h2 style="margin:0 0 16px;font-size:20px;color:${BRAND_COLORS.textDark};">
      You earned a ${amount} referral credit ${badge("CREDIT", "#ecfdf5", "#059669")}
    </h2>
    <p style="margin:0 0 16px;font-size:15px;color:${BRAND_COLORS.textDark};line-height:1.6;">
      Hi ${escapeHtml(subscriberName)},
    </p>
    <p style="margin:0 0 24px;font-size:15px;color:${BRAND_COLORS.textDark};line-height:1.6;">
      Someone just used your referral code. You have earned a <strong>${amount} credit</strong>, which will be applied to a future invoice.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND_COLORS.gray};border-radius:8px;padding:16px;margin-bottom:24px;">
      <tr>
        <td>
          <p style="margin:0 0 4px;font-size:13px;color:${BRAND_COLORS.textMuted};text-transform:uppercase;letter-spacing:0.5px;">Total credits earned</p>
          <p style="margin:0;font-size:24px;font-weight:700;color:${BRAND_COLORS.textDark};">${total}</p>
        </td>
      </tr>
    </table>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
      <tr>
        <td style="background-color:${BRAND_COLORS.azure};border-radius:8px;">
          <a href="${portalUrl}/subscription" style="display:inline-block;padding:12px 32px;font-size:15px;font-weight:600;color:${BRAND_COLORS.white};text-decoration:none;">
            View My Plan
          </a>
        </td>
      </tr>
    </table>`;

  return {
    subject: "You earned a $25 referral credit",
    html: baseLayout(content, unsubscribeUrl),
  };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
