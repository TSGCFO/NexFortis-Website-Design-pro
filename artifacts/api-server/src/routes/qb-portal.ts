import { Router, type Request, type Response, type NextFunction, type RequestHandler } from "express";
import { db } from "@workspace/db";
import { qbUsers, qbOrders, qbOrderFiles, qbWaitlistSignups, qbSupportTickets, qbPasswordResets } from "@workspace/db/schema";
import { eq, and, desc } from "drizzle-orm";
import crypto from "crypto";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from "fs";
import Stripe from "stripe";

const router = Router();

interface CatalogProduct {
  id: number;
  slug: string;
  name: string;
  price_cad: number;
  is_addon: boolean;
  badge: string;
  requires_service: number | null;
}

interface ProductCatalog {
  services: CatalogProduct[];
}

let catalog: ProductCatalog | null = null;
function loadCatalog(): ProductCatalog {
  if (!catalog) {
    const catalogPath = path.resolve(__dirname, "../../../../artifacts/qb-portal/public/products.json");
    catalog = JSON.parse(fs.readFileSync(catalogPath, "utf-8"));
  }
  return catalog!;
}

function computeOrderTotal(serviceId: number, addonIds: number[]): { total: number; serviceName: string; addonNames: string[] } | null {
  const cat = loadCatalog();
  const service = cat.services.find(s => s.id === serviceId && !s.is_addon && s.badge === "available");
  if (!service) return null;

  let total = service.price_cad;
  const addonNames: string[] = [];

  for (const addonId of addonIds) {
    const addon = cat.services.find(s => s.id === addonId && s.is_addon && s.badge === "available");
    if (!addon) return null;
    if (addon.requires_service !== null && addon.requires_service !== serviceId) return null;
    total += addon.price_cad;
    addonNames.push(addon.name);
  }

  return { total, serviceName: service.name, addonNames };
}

const BCRYPT_ROUNDS = 12;
const TOKEN_SECRET = process.env["QB_TOKEN_SECRET"] || (() => {
  console.warn("[WARN] QB_TOKEN_SECRET not set — generating ephemeral secret. Sessions will not survive restarts.");
  return crypto.randomBytes(32).toString("hex");
})();

const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const COOKIE_NAME = "qb_session";

const stripe = process.env["STRIPE_SECRET_KEY"]
  ? new Stripe(process.env["STRIPE_SECRET_KEY"])
  : null;

const UPLOADS_DIR = path.resolve(process.cwd(), "uploads");
const MAX_UPLOAD_BYTES = 500 * 1024 * 1024;

const upload = multer({
  dest: UPLOADS_DIR,
  limits: { fileSize: MAX_UPLOAD_BYTES },
  fileFilter: (_req, file, cb) => {
    if (file.originalname.toLowerCase().endsWith(".qbm")) {
      cb(null, true);
    } else {
      cb(new Error("Only .QBM files are accepted"));
    }
  },
});

function generateToken(userId: number): string {
  const payload = Buffer.from(JSON.stringify({
    uid: userId,
    iat: Date.now(),
    exp: Date.now() + SESSION_MAX_AGE_MS,
  })).toString("base64url");
  const sig = crypto.createHmac("sha256", TOKEN_SECRET).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

function verifyToken(token: string): number | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payload, sig] = parts;
  const expected = crypto.createHmac("sha256", TOKEN_SECRET).update(payload!).digest("base64url");
  if (!crypto.timingSafeEqual(Buffer.from(sig!), Buffer.from(expected))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload!, "base64url").toString());
    if (typeof data.uid !== "number") return null;
    if (data.exp && Date.now() > data.exp) return null;
    return data.uid;
  } catch {
    return null;
  }
}

function extractUserId(req: Request): number | null {
  const cookieToken = (req as unknown as Record<string, Record<string, string>>).cookies?.[COOKIE_NAME];
  if (cookieToken) {
    const uid = verifyToken(cookieToken);
    if (uid) return uid;
  }
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return verifyToken(authHeader.slice(7));
  }
  return null;
}

function setSessionCookie(res: Response, token: string) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE_MS,
    path: "/api/qb",
  });
}

const requireAuth: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const userId = extractUserId(req);
  if (!userId) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  (req as unknown as Record<string, unknown>)["userId"] = userId;
  next();
};

function getUserId(req: Request): number {
  return (req as unknown as Record<string, unknown>)["userId"] as number;
}

const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000;

function checkRateLimit(email: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(email);
  if (!record) return true;
  if (now - record.lastAttempt > RATE_LIMIT_WINDOW) {
    loginAttempts.delete(email);
    return true;
  }
  return record.count < RATE_LIMIT_MAX;
}

function recordLoginAttempt(email: string) {
  const now = Date.now();
  const record = loginAttempts.get(email);
  if (!record || now - record.lastAttempt > RATE_LIMIT_WINDOW) {
    loginAttempts.set(email, { count: 1, lastAttempt: now });
  } else {
    record.count++;
    record.lastAttempt = now;
  }
}

router.post("/auth/register", async (req: Request, res: Response) => {
  try {
    const { email, password, name, phone } = req.body;
    if (!email || !password || !name) {
      res.status(400).json({ error: "Email, password, and name are required" });
      return;
    }
    if (password.length < 8) {
      res.status(400).json({ error: "Password must be at least 8 characters" });
      return;
    }

    const existing = await db.select().from(qbUsers).where(eq(qbUsers.email, email)).limit(1);
    if (existing.length > 0) {
      res.status(409).json({ error: "An account with this email already exists" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const [user] = await db.insert(qbUsers).values({ email, passwordHash, name, phone: phone || null }).returning();
    const token = generateToken(user.id);
    setSessionCookie(res, token);

    res.status(201).json({ user: { id: user.id, email: user.email, name: user.name, phone: user.phone }, token });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    if (!checkRateLimit(email)) {
      res.status(429).json({ error: "Too many login attempts. Please try again in 15 minutes." });
      return;
    }

    const [user] = await db.select().from(qbUsers).where(eq(qbUsers.email, email)).limit(1);
    if (!user) {
      recordLoginAttempt(email);
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      recordLoginAttempt(email);
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const token = generateToken(user.id);
    setSessionCookie(res, token);
    res.json({ user: { id: user.id, email: user.email, name: user.name, phone: user.phone }, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/auth/logout", (_req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME, { path: "/api/qb" });
  res.json({ success: true });
});

router.post("/auth/forgot-password", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: "Email is required" });
      return;
    }

    const [user] = await db.select().from(qbUsers).where(eq(qbUsers.email, email)).limit(1);
    if (!user) {
      res.json({ success: true, message: "If an account exists with that email, a reset link has been sent." });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await db.insert(qbPasswordResets).values({ userId: user.id, tokenHash, expiresAt });

    const isDev = process.env.NODE_ENV !== "production";
    if (isDev) {
      console.log(`[Password Reset] Dev-mode reset link: /reset-password?token=${resetToken}`);
    }

    const response: Record<string, unknown> = {
      success: true,
      message: "If an account exists with that email, a reset link has been sent.",
    };
    if (isDev) {
      response.resetToken = resetToken;
      response.resetUrl = `/reset-password?token=${resetToken}`;
    }
    res.json(response);
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Failed to process request" });
  }
});

router.post("/auth/reset-password", async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      res.status(400).json({ error: "Token and new password are required" });
      return;
    }
    if (newPassword.length < 8) {
      res.status(400).json({ error: "Password must be at least 8 characters" });
      return;
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const [resetRecord] = await db.select().from(qbPasswordResets)
      .where(and(eq(qbPasswordResets.tokenHash, tokenHash), eq(qbPasswordResets.used, false)))
      .limit(1);

    if (!resetRecord || new Date() > resetRecord.expiresAt) {
      res.status(400).json({ error: "Invalid or expired reset token" });
      return;
    }

    const newHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    await db.update(qbUsers).set({ passwordHash: newHash }).where(eq(qbUsers.id, resetRecord.userId));
    await db.update(qbPasswordResets).set({ used: true }).where(eq(qbPasswordResets.id, resetRecord.id));

    res.json({ success: true });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "Failed to reset password" });
  }
});

router.post("/waitlist", async (req: Request, res: Response) => {
  try {
    const { email, product_id, product_name } = req.body;
    if (!email || !product_id) {
      res.status(400).json({ error: "Email and product_id are required" });
      return;
    }

    const existing = await db.select().from(qbWaitlistSignups)
      .where(and(eq(qbWaitlistSignups.email, email), eq(qbWaitlistSignups.productId, product_id)))
      .limit(1);

    if (existing.length > 0) {
      res.status(409).json({ error: "duplicate" });
      return;
    }

    await db.insert(qbWaitlistSignups).values({
      email,
      productId: product_id,
      productName: product_name || `Product #${product_id}`,
    });

    res.status(201).json({ success: true });
  } catch (err) {
    console.error("Waitlist error:", err);
    res.status(500).json({ error: "Failed to join waitlist" });
  }
});

router.post("/checkout/create-session", async (req: Request, res: Response) => {
  try {
    const { serviceId, addonIds, qbVersion, customerName, customerEmail, customerPhone } = req.body;
    if (!serviceId || !customerName || !customerEmail) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const pricing = computeOrderTotal(serviceId, addonIds || []);
    if (!pricing) {
      res.status(400).json({ error: "Invalid service or add-on selection" });
      return;
    }

    const userId = extractUserId(req);
    const uploadToken = crypto.randomBytes(32).toString("hex");

    const [order] = await db.insert(qbOrders).values({
      userId,
      serviceId,
      serviceName: pricing.serviceName,
      addons: pricing.addonNames.length > 0 ? JSON.stringify(pricing.addonNames) : null,
      totalCad: pricing.total,
      qbVersion,
      customerName,
      customerEmail,
      customerPhone,
      uploadToken,
      status: "pending_payment",
    }).returning();

    if (stripe) {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: customerEmail,
        line_items: [{
          price_data: {
            currency: "cad",
            product_data: { name: pricing.serviceName },
            unit_amount: pricing.total * 100,
          },
          quantity: 1,
        }],
        metadata: { orderId: String(order.id), uploadToken },
        success_url: `${req.headers.origin || "http://localhost"}/qb-portal/order/${order.id}?success=true&uploadToken=${uploadToken}`,
        cancel_url: `${req.headers.origin || "http://localhost"}/qb-portal/order?canceled=true`,
      });

      await db.update(qbOrders).set({ stripeSessionId: session.id }).where(eq(qbOrders.id, order.id));

      res.status(201).json({
        orderId: order.id,
        uploadToken,
        checkoutUrl: session.url,
        testMode: !process.env["STRIPE_SECRET_KEY"]?.startsWith("sk_live"),
      });
    } else {
      await db.update(qbOrders).set({ status: "submitted" }).where(eq(qbOrders.id, order.id));

      res.status(201).json({
        orderId: order.id,
        order: { ...order, status: "submitted" },
        uploadToken,
        checkoutUrl: null,
        testMode: true,
        message: "Stripe not configured — order created with simulated payment.",
      });
    }
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

router.post("/webhook/stripe", async (req: Request, res: Response) => {
  if (!stripe) {
    res.json({ received: true, message: "Stripe not configured" });
    return;
  }

  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env["STRIPE_WEBHOOK_SECRET"];

  if (!sig || !endpointSecret) {
    res.status(400).json({ error: "Missing signature or webhook secret" });
    return;
  }

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = parseInt(session.metadata?.orderId || "0");
      if (orderId) {
        await db.update(qbOrders).set({
          status: "submitted",
          stripeSessionId: session.id,
        }).where(eq(qbOrders.id, orderId));
        console.log(`[Stripe] Payment confirmed for order ${orderId}`);
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Stripe webhook error:", err);
    res.status(400).json({ error: "Webhook verification failed" });
  }
});

router.get("/orders/lookup", async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.query.orderId as string);
    const uploadToken = req.query.uploadToken as string;

    if (isNaN(orderId) || !uploadToken) {
      res.status(400).json({ error: "orderId and uploadToken are required" });
      return;
    }

    const [order] = await db.select().from(qbOrders)
      .where(and(eq(qbOrders.id, orderId), eq(qbOrders.uploadToken, uploadToken)))
      .limit(1);

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    const files = await db.select().from(qbOrderFiles)
      .where(eq(qbOrderFiles.orderId, orderId));

    const { uploadToken: _ut, ...safeOrder } = order;
    res.json({ order: safeOrder, files });
  } catch (err) {
    console.error("Order lookup error:", err);
    res.status(500).json({ error: "Failed to look up order" });
  }
});

router.get("/orders", requireAuth, async (req: Request, res: Response) => {
  try {
    const uid = getUserId(req);
    const orders = await db.select().from(qbOrders)
      .where(eq(qbOrders.userId, uid))
      .orderBy(desc(qbOrders.createdAt));
    res.json({ orders });
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.get("/orders/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const uid = getUserId(req);
    const orderId = parseInt(req.params.id as string);
    const [order] = await db.select().from(qbOrders)
      .where(and(eq(qbOrders.id, orderId), eq(qbOrders.userId, uid)))
      .limit(1);
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    const files = await db.select().from(qbOrderFiles)
      .where(eq(qbOrderFiles.orderId, orderId));

    res.json({ order, files });
  } catch (err) {
    console.error("Get order error:", err);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

router.post("/orders/:id/files", (req: Request, res: Response) => {
  const orderId = parseInt(req.params.id as string);
  if (isNaN(orderId)) {
    res.status(400).json({ error: "Invalid order ID" });
    return;
  }

  const userId = extractUserId(req);
  const uploadTokenHeader = (req.headers["x-upload-token"] as string) || (req.query.uploadToken as string);

  if (!userId && !uploadTokenHeader) {
    res.status(401).json({ error: "Authentication or upload token required" });
    return;
  }

  const singleUpload = upload.single("file");
  singleUpload(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
        res.status(413).json({ error: "File exceeds 500 MB limit" });
      } else {
        res.status(400).json({ error: err.message || "Upload failed" });
      }
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: "No file provided" });
      return;
    }

    try {
      let orderQuery;
      if (userId) {
        orderQuery = await db.select().from(qbOrders)
          .where(and(eq(qbOrders.id, orderId), eq(qbOrders.userId, userId)))
          .limit(1);
      } else {
        orderQuery = await db.select().from(qbOrders)
          .where(and(eq(qbOrders.id, orderId), eq(qbOrders.uploadToken, uploadTokenHeader)))
          .limit(1);
      }

      const [order] = orderQuery;
      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
      }

      const [fileRecord] = await db.insert(qbOrderFiles).values({
        orderId,
        fileType: "qbm",
        fileName: req.file.originalname,
        storagePath: req.file.filename,
        fileSizeBytes: req.file.size,
      }).returning();

      console.log(`[File Upload] Order ${orderId}: ${req.file.originalname} (${req.file.size} bytes) -> ${req.file.filename}`);

      res.status(201).json({ file: fileRecord });
    } catch (dbErr) {
      console.error("File upload DB error:", dbErr);
      res.status(500).json({ error: "Failed to record file upload" });
    }
  });
});

router.get("/orders/:id/files/:fileId/download", async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id as string);
    const fileId = parseInt(req.params.fileId as string);
    if (isNaN(orderId) || isNaN(fileId)) {
      res.status(400).json({ error: "Invalid IDs" });
      return;
    }

    const userId = extractUserId(req);
    const uploadTokenHeader = req.query.uploadToken as string;

    if (!userId && !uploadTokenHeader) {
      res.status(401).json({ error: "Authentication or upload token required" });
      return;
    }

    let orderQuery;
    if (userId) {
      orderQuery = await db.select().from(qbOrders)
        .where(and(eq(qbOrders.id, orderId), eq(qbOrders.userId, userId)))
        .limit(1);
    } else {
      orderQuery = await db.select().from(qbOrders)
        .where(and(eq(qbOrders.id, orderId), eq(qbOrders.uploadToken, uploadTokenHeader)))
        .limit(1);
    }

    const [order] = orderQuery;
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    const [file] = await db.select().from(qbOrderFiles)
      .where(and(eq(qbOrderFiles.id, fileId), eq(qbOrderFiles.orderId, orderId)))
      .limit(1);

    if (!file || !file.storagePath) {
      res.status(404).json({ error: "File not found" });
      return;
    }

    const filePath = path.join(UPLOADS_DIR, file.storagePath);
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: "File no longer available" });
      return;
    }

    res.setHeader("Content-Disposition", `attachment; filename="${file.fileName}"`);
    res.setHeader("Content-Type", "application/octet-stream");
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  } catch (err) {
    console.error("File download error:", err);
    res.status(500).json({ error: "Download failed" });
  }
});

router.post("/support-tickets", requireAuth, async (req: Request, res: Response) => {
  try {
    const uid = getUserId(req);
    const { subject, message } = req.body;
    if (!subject || !message) {
      res.status(400).json({ error: "Subject and message are required" });
      return;
    }

    const [ticket] = await db.insert(qbSupportTickets).values({
      userId: uid,
      subject,
      message,
      status: "open",
    }).returning();

    res.status(201).json({ ticket });
  } catch (err) {
    console.error("Support ticket error:", err);
    res.status(500).json({ error: "Failed to create ticket" });
  }
});

router.get("/support-tickets", requireAuth, async (req: Request, res: Response) => {
  try {
    const uid = getUserId(req);
    const tickets = await db.select().from(qbSupportTickets)
      .where(eq(qbSupportTickets.userId, uid))
      .orderBy(desc(qbSupportTickets.createdAt));
    res.json({ tickets });
  } catch (err) {
    console.error("Get tickets error:", err);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
});

router.get("/me", requireAuth, async (req: Request, res: Response) => {
  try {
    const uid = getUserId(req);
    const [user] = await db.select().from(qbUsers).where(eq(qbUsers.id, uid)).limit(1);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({ user: { id: user.id, email: user.email, name: user.name, phone: user.phone } });
  } catch (err) {
    console.error("Get me error:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

router.put("/me", requireAuth, async (req: Request, res: Response) => {
  try {
    const uid = getUserId(req);
    const { name, phone } = req.body;
    const updates: Record<string, string | null> = {};
    if (name) updates.name = name;
    if (phone !== undefined) updates.phone = phone || null;

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ error: "No fields to update" });
      return;
    }

    const [user] = await db.update(qbUsers)
      .set(updates)
      .where(eq(qbUsers.id, uid))
      .returning();

    res.json({ user: { id: user.id, email: user.email, name: user.name, phone: user.phone } });
  } catch (err) {
    console.error("Update me error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

router.put("/me/password", requireAuth, async (req: Request, res: Response) => {
  try {
    const uid = getUserId(req);
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: "Current and new passwords are required" });
      return;
    }
    if (newPassword.length < 8) {
      res.status(400).json({ error: "New password must be at least 8 characters" });
      return;
    }

    const [user] = await db.select().from(qbUsers).where(eq(qbUsers.id, uid)).limit(1);
    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    const passwordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!passwordValid) {
      res.status(401).json({ error: "Current password is incorrect" });
      return;
    }

    const newHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    await db.update(qbUsers).set({ passwordHash: newHash }).where(eq(qbUsers.id, uid));

    res.json({ success: true });
  } catch (err) {
    console.error("Password change error:", err);
    res.status(500).json({ error: "Failed to change password" });
  }
});

export default router;
