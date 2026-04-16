import type { Request, Response, NextFunction, RequestHandler } from "express";
import crypto from "crypto";
import { db, operatorUsers } from "@workspace/db";
import { eq } from "drizzle-orm";

export interface OperatorTokenPayload {
  operatorId: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      operatorUser?: { id: number; email: string; name: string };
    }
  }
}

let warnedNoSecret = false;

export function getSessionSecret(): string | null {
  const secret = process.env.SESSION_SECRET || process.env.BLOG_ADMIN_SECRET;
  if (!secret) {
    if (!warnedNoSecret) {
      console.warn(
        "[blog-admin] SESSION_SECRET (and BLOG_ADMIN_SECRET fallback) is not set. Blog admin auth is disabled."
      );
      warnedNoSecret = true;
    }
    return null;
  }
  return secret;
}

function b64url(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(str: string): Buffer {
  const pad = str.length % 4 === 0 ? "" : "=".repeat(4 - (str.length % 4));
  return Buffer.from(str.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64");
}

export function signOperatorToken(payload: OperatorTokenPayload): string | null {
  const secret = getSessionSecret();
  if (!secret) return null;
  const body = b64url(Buffer.from(JSON.stringify(payload)));
  const sig = b64url(crypto.createHmac("sha256", secret).update(body).digest());
  return `${body}.${sig}`;
}

export function verifyOperatorToken(token: string): OperatorTokenPayload | null {
  const secret = getSessionSecret();
  if (!secret) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  if (!body || !sig) return null;
  const expectedSig = b64url(crypto.createHmac("sha256", secret).update(body).digest());
  const a = Buffer.from(sig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(fromB64url(body).toString()) as OperatorTokenPayload;
    if (typeof payload.operatorId !== "number" || typeof payload.exp !== "number") return null;
    if (Date.now() / 1000 > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

function readToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) return header.slice(7);
  const cookieToken = (req as Request & { cookies?: Record<string, string> }).cookies?.["operator_session"];
  return cookieToken || null;
}

export const requireBlogAdmin: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = readToken(req);
    if (!token) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }
    const payload = verifyOperatorToken(token);
    if (!payload) {
      res.status(401).json({ error: "Invalid or expired session" });
      return;
    }
    const [op] = await db
      .select({ id: operatorUsers.id, email: operatorUsers.email, name: operatorUsers.name })
      .from(operatorUsers)
      .where(eq(operatorUsers.id, payload.operatorId))
      .limit(1);
    if (!op) {
      res.status(401).json({ error: "Operator not found" });
      return;
    }
    req.operatorUser = op;
    next();
  } catch (err) {
    console.error("[requireBlogAdmin] error:", err);
    res.status(500).json({ error: "Auth check failed" });
  }
};
