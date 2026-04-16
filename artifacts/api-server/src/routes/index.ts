import { Router, type IRouter } from "express";
import rateLimit from "express-rate-limit";
import healthRouter from "./health";
import blogRouter from "./blog";
import contactRouter from "./contact";
import qbPortalRouter, { requireAuth, requireOperator } from "./qb-portal";
import qbSubscriptionsRouter from "./qb-subscriptions";
import qbAdminSubscriptionsRouter from "./qb-admin-subscriptions";

const router: IRouter = Router();

const checkoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." },
});

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." },
});

router.use(healthRouter);
router.use("/blog", blogRouter);
router.post("/contact", contactLimiter);
router.use("/contact", contactRouter);
router.post("/qb/checkout/create-session", checkoutLimiter);
router.use("/qb", qbPortalRouter);
router.use("/qb/subscriptions", requireAuth, qbSubscriptionsRouter);
router.use("/qb/admin", requireOperator, qbAdminSubscriptionsRouter);

export default router;
