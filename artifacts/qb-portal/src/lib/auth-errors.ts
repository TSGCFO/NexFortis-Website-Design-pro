/**
 * Maps Supabase auth errors to user-friendly copy.
 *
 * NOTE FOR OPERATORS: Supabase's built-in SMTP is rate-limited to ~4 emails/hour
 * for the entire project. To lift this cap in production, go to:
 *   Supabase Dashboard -> Project Settings -> Auth -> SMTP Settings
 * and enter SMTP credentials from a transactional email provider
 * (Resend, SendGrid, AWS SES, etc.). No code change is required.
 */

const FALLBACK = "Something went wrong. Please try again or contact support.";

export const AUTH_ERROR_RATE_LIMIT =
  "We're experiencing a temporary hiccup sending confirmation emails. Please try again in a few minutes, or sign up with Google / Microsoft instead.";

export const AUTH_ERROR_RATE_LIMIT_RESET =
  "We've sent too many password reset emails recently. Please try again in a few minutes.";

export const AUTH_ERROR_USER_EXISTS =
  "An account with this email already exists — try signing in instead.";

export const AUTH_ERROR_INVALID_CREDENTIALS = "Incorrect email or password.";

export const AUTH_ERROR_EMAIL_NOT_CONFIRMED =
  "Please confirm your email address before signing in. Check your inbox (and spam folder) for the confirmation link.";

export const AUTH_ERROR_SIGNUP_DISABLED =
  "New account signups are temporarily disabled. Please contact support if you need access.";

export const AUTH_ERROR_WEAK_PASSWORD =
  "Please choose a stronger password — at least 8 characters with a mix of letters and numbers.";

interface MaybeAuthError {
  code?: string;
  status?: number;
  message?: string;
  name?: string;
}

export type AuthErrorContext = "signUp" | "signIn" | "resetPassword";

export function mapAuthError(
  error: unknown,
  context: AuthErrorContext = "signIn",
): string {
  if (!error) return FALLBACK;

  const e = error as MaybeAuthError;
  const code = (e.code || "").toLowerCase();
  const status = e.status;
  const msg = (e.message || "").toLowerCase();

  if (
    code === "over_email_send_rate_limit" ||
    code === "over_request_rate_limit" ||
    code === "email_send_rate_limit" ||
    status === 429 ||
    /rate limit|too many requests/i.test(msg)
  ) {
    return context === "resetPassword"
      ? AUTH_ERROR_RATE_LIMIT_RESET
      : AUTH_ERROR_RATE_LIMIT;
  }

  if (
    code === "user_already_exists" ||
    code === "email_exists" ||
    /user already registered|already registered|already exists/i.test(msg)
  ) {
    return AUTH_ERROR_USER_EXISTS;
  }

  if (
    code === "email_not_confirmed" ||
    /email not confirmed|confirm your email/i.test(msg)
  ) {
    return AUTH_ERROR_EMAIL_NOT_CONFIRMED;
  }

  if (
    code === "invalid_credentials" ||
    code === "invalid_grant" ||
    /invalid login credentials|invalid email or password|invalid credentials/i.test(
      msg,
    )
  ) {
    return AUTH_ERROR_INVALID_CREDENTIALS;
  }

  if (
    code === "signup_disabled" ||
    /signups not allowed|signup is disabled|signups are disabled/i.test(msg)
  ) {
    return AUTH_ERROR_SIGNUP_DISABLED;
  }

  if (
    code === "weak_password" ||
    /password should be at least|password is too short|weak password|password.*characters/i.test(
      msg,
    )
  ) {
    return AUTH_ERROR_WEAK_PASSWORD;
  }

  if (code === "validation_failed" || /invalid email/i.test(msg)) {
    return "Please enter a valid email address.";
  }

  return FALLBACK;
}
