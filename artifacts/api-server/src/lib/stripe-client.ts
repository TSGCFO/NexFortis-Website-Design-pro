import Stripe from "stripe";

interface ConnectorConnectionSettings {
  settings: {
    publishable: string;
    secret: string;
    account_id?: string;
  };
}

interface ConnectorResponse {
  items?: ConnectorConnectionSettings[];
}

async function getCredentials(): Promise<{ publishableKey: string; secretKey: string }> {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? "repl " + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
      ? "depl " + process.env.WEB_REPL_RENEWAL
      : null;

  if (!xReplitToken || !hostname) {
    const fallbackKey = process.env["STRIPE_SECRET_KEY"];
    if (fallbackKey) {
      return { publishableKey: "", secretKey: fallbackKey };
    }
    throw new Error("No Stripe credentials available (no Replit connector and no STRIPE_SECRET_KEY)");
  }

  const connectorName = "stripe";
  const isProduction = process.env.REPLIT_DEPLOYMENT === "1";
  const targetEnvironment = isProduction ? "production" : "development";

  const url = new URL(`https://${hostname}/api/v2/connection`);
  url.searchParams.set("include_secrets", "true");
  url.searchParams.set("connector_names", connectorName);
  url.searchParams.set("environment", targetEnvironment);

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        "X-Replit-Token": xReplitToken,
      },
    });

    if (!response.ok) {
      console.error(`[stripe-client] Connector API returned ${response.status}: ${response.statusText}`);
      throw new Error(`Stripe connector request failed with status ${response.status}`);
    }

    const data = (await response.json()) as ConnectorResponse;
    const connection = data.items?.[0];

    if (!connection || (!connection.settings.publishable && !connection.settings.secret)) {
      throw new Error(`Stripe ${targetEnvironment} connection not found`);
    }

    return {
      publishableKey: connection.settings.publishable,
      secretKey: connection.settings.secret,
    };
  } catch (connectorErr) {
    // Connector failed — fall back to STRIPE_SECRET_KEY env var
    console.warn(`[stripe-client] Connector failed, checking STRIPE_SECRET_KEY fallback:`, connectorErr);
    const fallbackKey = process.env["STRIPE_SECRET_KEY"];
    if (fallbackKey) {
      return { publishableKey: "", secretKey: fallbackKey };
    }
    throw connectorErr;
  }
}

export async function getStripeClient(): Promise<Stripe> {
  const { secretKey } = await getCredentials();
  return new Stripe(secretKey);
}

export async function getStripePublishableKey(): Promise<string> {
  const { publishableKey } = await getCredentials();
  return publishableKey;
}

export async function getStripeSecretKey(): Promise<string> {
  const { secretKey } = await getCredentials();
  return secretKey;
}

export async function isTestMode(): Promise<boolean> {
  try {
    const { secretKey } = await getCredentials();
    return !secretKey.startsWith("sk_live");
  } catch {
    return true;
  }
}
