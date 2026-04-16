import { Router, type Request, type Response } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import bcrypt from "bcryptjs";
import { db, operatorUsers } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  requireBlogAdmin,
  signOperatorToken,
  getSessionSecret,
} from "../middleware/require-blog-admin";

const router = Router();

const SESSION_TTL_SECONDS = 60 * 60 * 24;
const COOKIE_NAME = "operator_session";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req as never),
  message: { error: "Too many login attempts. Please try again later." },
});

router.post("/login", loginLimiter, async (req: Request, res: Response) => {
  try {
    const { email, password } = (req.body || {}) as { email?: string; password?: string };
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const secret = getSessionSecret();
    if (!secret) {
      res.status(503).json({ error: "Auth is not configured" });
      return;
    }

    const [op] = await db
      .select()
      .from(operatorUsers)
      .where(eq(operatorUsers.email, email.toLowerCase().trim()))
      .limit(1);

    if (!op) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const ok = await bcrypt.compare(password, op.passwordHash);
    if (!ok) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
    const token = signOperatorToken({ operatorId: op.id, exp });
    if (!token) {
      res.status(503).json({ error: "Auth is not configured" });
      return;
    }

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_TTL_SECONDS * 1000,
      path: "/",
    });

    res.json({
      success: true,
      operator: { id: op.id, email: op.email, name: op.name },
    });
  } catch (err) {
    console.error("[operator-auth/login] error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/logout", (_req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME, { path: "/" });
  res.json({ success: true });
});

router.get("/me", requireBlogAdmin, (req: Request, res: Response) => {
  res.json({ operator: req.operatorUser });
});

export default router;
