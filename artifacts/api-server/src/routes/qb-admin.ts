import { Router, type Request, type Response, type NextFunction } from "express";
import { db } from "@workspace/db";
import { qbOrders, qbOrderFiles, qbUsers, qbSupportTickets } from "@workspace/db/schema";
import { eq, and, desc, asc, sql, ilike, or, inArray } from "drizzle-orm";
import multer from "multer";
import path from "path";
import { supabaseAdmin, isStorageAvailable } from "../lib/supabase";

const router = Router();

const MAX_UPLOAD_BYTES = 500 * 1024 * 1024;
const ALLOWED_EXTENSIONS = [".qbm", ".qbw", ".qbb", ".csv", ".xlsx", ".pdf", ".zip", ".html", ".txt"];

const adminUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_BYTES },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_EXTENSIONS.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${ext} is not allowed. Accepted: ${ALLOWED_EXTENSIONS.join(", ")}`));
    }
  },
});

const VALID_ORDER_STATUSES = ["pending_payment", "submitted", "paid", "processing", "completed", "failed", "cancelled"];

router.get("/dashboard", async (_req: Request, res: Response) => {
  try {
    const [
      [orderStats],
      [customerStats],
      [ticketStats],
      recentOrders,
    ] = await Promise.all([
      db.select({
        total: sql<number>`count(*)::int`,
        pending: sql<number>`count(*) filter (where ${qbOrders.status} in ('pending_payment', 'submitted', 'paid'))::int`,
        processing: sql<number>`count(*) filter (where ${qbOrders.status} = 'processing')::int`,
        completed: sql<number>`count(*) filter (where ${qbOrders.status} = 'completed')::int`,
      }).from(qbOrders),
      db.select({
        total: sql<number>`count(*)::int`,
      }).from(qbUsers).where(eq(qbUsers.role, "customer")),
      db.select({
        open: sql<number>`count(*) filter (where ${qbSupportTickets.status} = 'open')::int`,
      }).from(qbSupportTickets),
      db.select({
        id: qbOrders.id,
        status: qbOrders.status,
        serviceId: qbOrders.serviceId,
        serviceName: qbOrders.serviceName,
        totalCad: qbOrders.totalCad,
        createdAt: qbOrders.createdAt,
        customerName: qbUsers.name,
        customerEmail: qbUsers.email,
        orderCustomerName: qbOrders.customerName,
        orderCustomerEmail: qbOrders.customerEmail,
      })
        .from(qbOrders)
        .leftJoin(qbUsers, eq(qbOrders.userId, qbUsers.id))
        .orderBy(desc(qbOrders.createdAt))
        .limit(5),
    ]);

    res.json({
      totalOrders: orderStats?.total ?? 0,
      pendingOrders: orderStats?.pending ?? 0,
      processingOrders: orderStats?.processing ?? 0,
      completedOrders: orderStats?.completed ?? 0,
      totalCustomers: customerStats?.total ?? 0,
      openTickets: ticketStats?.open ?? 0,
      recentOrders: recentOrders.map(r => ({
        id: r.id,
        status: r.status,
        serviceId: r.serviceId,
        serviceName: r.serviceName,
        totalCad: r.totalCad,
        createdAt: r.createdAt,
        customerName: r.customerName ?? r.orderCustomerName,
        customerEmail: r.customerEmail ?? r.orderCustomerEmail,
      })),
    });
  } catch (err) {
    console.error("Admin dashboard error:", err);
    res.status(500).json({ error: "Failed to load dashboard" });
  }
});

router.get("/orders", async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;
    const sortField = (req.query.sort as string) || "createdAt";
    const sortDir = (req.query.order as string) || "desc";

    const conditions = [];
    if (status) {
      if (!VALID_ORDER_STATUSES.includes(status)) {
        res.status(400).json({ error: `Invalid status "${status}". Must be one of: ${VALID_ORDER_STATUSES.join(", ")}` });
        return;
      }
      conditions.push(eq(qbOrders.status, status));
    }
    if (search) {
      conditions.push(
        or(
          ilike(qbOrders.customerName, `%${search}%`),
          ilike(qbOrders.customerEmail, `%${search}%`),
        )
      );
    }
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [countResult] = await db.select({
      total: sql<number>`count(*)::int`,
    }).from(qbOrders).where(whereClause);

    const total = countResult?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const actualPage = Math.min(page, totalPages);
    const offset = (actualPage - 1) * limit;

    const sortColumn = sortField === "status" ? qbOrders.status
      : sortField === "totalCad" ? qbOrders.totalCad
      : sortField === "customerName" ? qbOrders.customerName
      : qbOrders.createdAt;
    const orderBy = sortDir === "asc" ? asc(sortColumn) : desc(sortColumn);

    const orders = await db.select({
      id: qbOrders.id,
      status: qbOrders.status,
      serviceId: qbOrders.serviceId,
      serviceName: qbOrders.serviceName,
      totalCad: qbOrders.totalCad,
      createdAt: qbOrders.createdAt,
      customerName: qbUsers.name,
      customerEmail: qbUsers.email,
      orderCustomerName: qbOrders.customerName,
      orderCustomerEmail: qbOrders.customerEmail,
    })
      .from(qbOrders)
      .leftJoin(qbUsers, eq(qbOrders.userId, qbUsers.id))
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const orderIds = orders.map(o => o.id);
    let fileCountMap: Record<number, boolean> = {};
    if (orderIds.length > 0) {
      const fileCounts = await db.select({
        orderId: qbOrderFiles.orderId,
        fileCount: sql<number>`count(*)::int`,
      }).from(qbOrderFiles)
        .where(inArray(qbOrderFiles.orderId, orderIds))
        .groupBy(qbOrderFiles.orderId);
      for (const fc of fileCounts) {
        fileCountMap[fc.orderId] = (fc.fileCount ?? 0) > 0;
      }
    }

    res.json({
      orders: orders.map(o => ({
        id: o.id,
        status: o.status,
        serviceId: o.serviceId,
        serviceName: o.serviceName,
        totalCad: o.totalCad,
        createdAt: o.createdAt,
        customerName: o.customerName ?? o.orderCustomerName,
        customerEmail: o.customerEmail ?? o.orderCustomerEmail,
        hasUploadedFile: fileCountMap[o.id] ?? false,
      })),
      total,
      page: actualPage,
      limit,
    });
  } catch (err) {
    console.error("Admin orders list error:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.get("/orders/:id", async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id as string);
    if (isNaN(orderId)) {
      res.status(400).json({ error: "Invalid order ID" });
      return;
    }

    const [order] = await db.select().from(qbOrders)
      .where(eq(qbOrders.id, orderId))
      .limit(1);

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    let customer = null;
    if (order.userId) {
      const [profile] = await db.select().from(qbUsers)
        .where(eq(qbUsers.id, order.userId))
        .limit(1);
      if (profile) {
        customer = { id: profile.id, name: profile.name, email: profile.email, phone: profile.phone };
      }
    }

    const files = await db.select().from(qbOrderFiles)
      .where(eq(qbOrderFiles.orderId, orderId))
      .orderBy(desc(qbOrderFiles.uploadedAt));

    res.json({
      order,
      customer,
      files,
    });
  } catch (err) {
    console.error("Admin order detail error:", err);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

router.patch("/orders/:id/status", async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id as string);
    if (isNaN(orderId)) {
      res.status(400).json({ error: "Invalid order ID" });
      return;
    }

    const { status } = req.body;
    if (!status || !VALID_ORDER_STATUSES.includes(status)) {
      res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_ORDER_STATUSES.join(", ")}` });
      return;
    }

    const [order] = await db.select().from(qbOrders)
      .where(eq(qbOrders.id, orderId))
      .limit(1);

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    const oldStatus = order.status;
    const [updated] = await db.update(qbOrders)
      .set({ status, updatedAt: new Date() })
      .where(eq(qbOrders.id, orderId))
      .returning();

    console.log(`[AUDIT] Order ${orderId} status changed from ${oldStatus} to ${status} by operator ${req.userId} at ${new Date().toISOString()}`);

    res.json({ order: updated });
  } catch (err) {
    console.error("Admin order status update error:", err);
    res.status(500).json({ error: "Failed to update order status" });
  }
});

router.get("/customers", async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const search = req.query.search as string | undefined;

    const conditions = [eq(qbUsers.role, "customer")];
    if (search) {
      const searchCondition = or(
        ilike(qbUsers.name, `%${search}%`),
        ilike(qbUsers.email, `%${search}%`),
      );
      if (searchCondition) conditions.push(searchCondition);
    }
    const whereClause = and(...conditions);

    const [countResult] = await db.select({
      total: sql<number>`count(*)::int`,
    }).from(qbUsers).where(whereClause);

    const total = countResult?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const actualPage = Math.min(page, totalPages);
    const offset = (actualPage - 1) * limit;

    const customers = await db.select({
      id: qbUsers.id,
      name: qbUsers.name,
      email: qbUsers.email,
      phone: qbUsers.phone,
      createdAt: qbUsers.createdAt,
      orderCount: sql<number>`(select count(*)::int from qb_orders where qb_orders.user_id = ${qbUsers.id})`,
      openTicketCount: sql<number>`(select count(*)::int from qb_support_tickets where qb_support_tickets.user_id = ${qbUsers.id} and qb_support_tickets.status = 'open')`,
    })
      .from(qbUsers)
      .where(whereClause)
      .orderBy(desc(qbUsers.createdAt))
      .limit(limit)
      .offset(offset);

    res.json({
      customers,
      total,
      page: actualPage,
      limit,
    });
  } catch (err) {
    console.error("Admin customers list error:", err);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

router.get("/orders/:orderId/files/:fileId/download", async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.orderId as string);
    const fileId = parseInt(req.params.fileId as string);
    if (isNaN(orderId) || isNaN(fileId)) {
      res.status(400).json({ error: "Invalid IDs" });
      return;
    }

    if (!supabaseAdmin) {
      res.status(503).json({ error: "Storage unavailable" });
      return;
    }

    const [file] = await db.select().from(qbOrderFiles)
      .where(and(eq(qbOrderFiles.id, fileId), eq(qbOrderFiles.orderId, orderId)))
      .limit(1);

    if (!file) {
      res.status(404).json({ error: "File not found" });
      return;
    }

    if (file.expired) {
      res.status(410).json({ error: "This file has been deleted per the 7-day retention policy." });
      return;
    }

    if (!file.storagePath) {
      res.status(410).json({ error: "File is no longer available." });
      return;
    }

    if (!(await isStorageAvailable())) {
      res.status(503).json({ error: "Storage unavailable" });
      return;
    }

    const { data: signedUrlData, error: signError } = await supabaseAdmin.storage
      .from("order-files")
      .createSignedUrl(file.storagePath, 900);

    if (signError || !signedUrlData?.signedUrl) {
      console.error("[Storage] Admin signed URL error:", signError);
      res.status(500).json({ error: "Failed to generate download URL" });
      return;
    }

    res.json({ signedUrl: signedUrlData.signedUrl });
  } catch (err) {
    console.error("Admin file download error:", err);
    res.status(500).json({ error: "Download failed" });
  }
});

router.post("/orders/:orderId/files/upload",
  async (req: Request, res: Response, next: NextFunction) => {
    const orderId = parseInt(req.params.orderId as string);
    if (isNaN(orderId)) {
      res.status(400).json({ error: "Invalid order ID" });
      return;
    }

    try {
      const [order] = await db.select().from(qbOrders)
        .where(eq(qbOrders.id, orderId))
        .limit(1);

      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
      }

      (req as any)._validatedOrder = order;
      next();
    } catch (err) {
      console.error("Admin file upload order check error:", err);
      res.status(500).json({ error: "Failed to validate order" });
    }
  },
  (req: Request, res: Response) => {
    const singleUpload = adminUpload.single("file");
    singleUpload(req, res, async (err) => {
      if (err) {
        if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
          res.status(413).json({ error: "File too large. Maximum size is 500MB." });
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
        const order = (req as any)._validatedOrder;
        const orderId = order.id as number;

        if (!supabaseAdmin) {
          res.status(503).json({ error: "Storage unavailable" });
          return;
        }

        if (!(await isStorageAvailable())) {
          res.status(503).json({ error: "Storage service is not configured." });
          return;
        }

        const SAFE_EXT_ALLOWLIST = ["qbm", "qbw", "qbb", "csv", "xlsx", "pdf", "zip", "html", "txt"];
        const rawExt = (req.file.originalname.split(".").pop() || "").toLowerCase();
        const safeExt = SAFE_EXT_ALLOWLIST.includes(rawExt) ? rawExt : "bin";
        const ownerId = order.userId || "anonymous";
        const storagePath = `${ownerId}/${orderId}/${Date.now()}-${crypto.randomUUID()}.${safeExt}`;
        const { error: uploadError } = await supabaseAdmin.storage
          .from("order-files")
          .upload(storagePath, req.file.buffer, {
            contentType: req.file.mimetype,
            upsert: false,
          });

        if (uploadError) {
          console.error("[Storage] Admin upload failed:", uploadError);
          res.status(500).json({ error: `Storage upload failed: ${uploadError.message}` });
          return;
        }

        const fileType = safeExt === "bin" ? "unknown" : safeExt;
        const safeFileName = req.file.originalname.replace(/[/\\]/g, "_");
        const [fileRecord] = await db.insert(qbOrderFiles).values({
          orderId,
          fileType,
          fileName: safeFileName,
          storagePath,
          fileSizeBytes: req.file.size,
        }).returning();

        console.log(`[File Upload] Admin: Order ${orderId}: ${safeFileName} (${req.file.size} bytes) -> ${storagePath}`);

        res.status(201).json({ file: fileRecord });
      } catch (dbErr) {
        console.error("Admin file upload error:", dbErr);
        res.status(500).json({ error: "Failed to record file upload" });
      }
    });
  },
);

export default router;
