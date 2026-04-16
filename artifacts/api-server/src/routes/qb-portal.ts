import { Router, type Request, type Response, type NextFunction, type RequestHandler } from "express";
import rateLimit from "express-rate-limit";
import { db } from "@workspace/db";
import { qbUsers, qbOrders, qbOrderFiles, qbWaitlistSignups, qbSupportTickets } from "@workspace/db/schema";
import { eq, and, desc } from "drizzle-orm";
import crypto from "crypto";
import multer from "multer";
import path from "path";
import fs from "fs";
import Stripe from "stripe";
import { supabaseAdmin } from "../lib/supabase";
import sanitizeHtml from "sanitize-html";

const router = Router();

const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: any) => req.userId || req.ip,
  message: { error: "Too many requests. Please try again later." },
});

const ticketLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: any) => req.userId || req.ip,
  message: { error: "Too many requests. Please try again later." },
});

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

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: string;
    }
  }
}

function sanitizeInput(input: string): string {
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
}

const requireAuth: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!supabaseAdmin) {
      res.status(503).json({ error: "Authentication service unavailable" });
      return;
    }

    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const token = authHeader.slice(7);
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    const [profile] = await db.select().from(qbUsers).where(eq(qbUsers.id, user.id)).limit(1);
    if (!profile) {
      res.status(401).json({ error: "User profile not found" });
      return;
    }

    req.userId = user.id;
    req.userRole = profile.role;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(503).json({ error: "Authentication service unavailable" });
  }
};

const requireOperator: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  await (requireAuth as (req: Request, res: Response, next: NextFunction) => Promise<void>)(req, res, () => {
    if (req.userRole !== "operator") {
      res.status(403).json({ error: "forbidden" });
      return;
    }

    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      res.status(403).json({ error: "MFA verification required. Please complete your two-factor authentication." });
      return;
    }

    try {
      const payload = authHeader.slice(7).split(".")[1];
      if (!payload) {
        res.status(403).json({ error: "MFA verification required. Please complete your two-factor authentication." });
        return;
      }
      const decoded = JSON.parse(Buffer.from(payload, "base64url").toString());
      if (decoded.aal !== "aal2") {
        res.status(403).json({ error: "MFA verification required. Please complete your two-factor authentication." });
        return;
      }
    } catch {
      res.status(403).json({ error: "MFA verification required. Please complete your two-factor authentication." });
      return;
    }

    next();
  });
};

function getUserId(req: Request): string {
  return req.userId!;
}

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

    const authHeader = req.headers.authorization;
    let userId: string | null = null;
    if (supabaseAdmin && authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      const { data: { user } } = await supabaseAdmin.auth.getUser(token);
      if (user) userId = user.id;
    }

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

  if (!endpointSecret) {
    if (process.env.NODE_ENV === "production") {
      res.status(400).json({ error: "Missing webhook secret" });
      return;
    }
    console.warn("STRIPE_WEBHOOK_SECRET not set — skipping signature verification in development");
  } else if (!sig) {
    res.status(400).json({ error: "Missing signature" });
    return;
  }

  try {
    const event = endpointSecret && sig
      ? stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
      : JSON.parse(Buffer.isBuffer(req.body) ? req.body.toString("utf-8") : typeof req.body === "string" ? req.body : JSON.stringify(req.body));

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

// orderLimiter targets file uploads (not order creation) because orders are
// created via Stripe checkout, which is already protected by checkoutLimiter.
// File upload is the authenticated order-related write that needs per-user limiting.
router.post("/orders/:id/files", orderLimiter, (req: Request, res: Response) => {
  const orderId = parseInt(req.params.id as string);
  if (isNaN(orderId)) {
    res.status(400).json({ error: "Invalid order ID" });
    return;
  }

  const authHeader = req.headers.authorization;
  const uploadTokenHeader = (req.headers["x-upload-token"] as string) || (req.query.uploadToken as string);

  let userIdPromise: Promise<string | null>;
  if (supabaseAdmin && authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    userIdPromise = supabaseAdmin.auth.getUser(token).then(({ data: { user } }) => user?.id || null);
  } else {
    userIdPromise = Promise.resolve(null);
  }

  if (!authHeader?.startsWith("Bearer ") && !uploadTokenHeader) {
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
      const userId = await userIdPromise;
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

    const authHeader = req.headers.authorization;
    const uploadTokenHeader = req.query.uploadToken as string;

    let userId: string | null = null;
    if (supabaseAdmin && authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      const { data: { user } } = await supabaseAdmin.auth.getUser(token);
      userId = user?.id || null;
    }

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

router.post("/support-tickets", requireAuth, ticketLimiter, async (req: Request, res: Response) => {
  try {
    const uid = getUserId(req);
    const { subject, message } = req.body;
    if (!subject || !message) {
      res.status(400).json({ error: "Subject and message are required" });
      return;
    }

    const [ticket] = await db.insert(qbSupportTickets).values({
      userId: uid,
      subject: sanitizeInput(subject),
      message: sanitizeInput(message),
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
    res.json({ user: { id: user.id, email: user.email, name: user.name, phone: user.phone, role: user.role } });
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
    if (name) updates.name = sanitizeInput(name);
    if (phone !== undefined) updates.phone = phone || null;

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ error: "No fields to update" });
      return;
    }

    const [user] = await db.update(qbUsers)
      .set(updates)
      .where(eq(qbUsers.id, uid))
      .returning();

    res.json({ user: { id: user.id, email: user.email, name: user.name, phone: user.phone, role: user.role } });
  } catch (err) {
    console.error("Update me error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

export { requireAuth, requireOperator };
export default router;
