import { Router, type IRouter } from "express";
import rateLimit from "express-rate-limit";
import healthRouter from "./health";
import blogRouter from "./blog";
import contactRouter from "./contact";
import qbPortalRouter, { requireAuth, requireOperator } from "./qb-portal";
import qbSubscriptionsRouter from "./qb-subscriptions";
import qbTicketsRouter from "./qb-tickets";
import qbAdminSubscriptionsRouter from "./qb-admin-subscriptions";
import qbAdminRouter from "./qb-admin";
import qbNotificationsRouter from "./qb-notifications";

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
router.use("/contact", contactLimiter, contactRouter);
router.post("/qb/checkout/create-session", checkoutLimiter);
router.use("/qb", qbPortalRouter);
router.use("/qb/subscriptions", requireAuth, qbSubscriptionsRouter);
router.use("/qb/tickets", requireAuth, qbTicketsRouter);
const adminRouter = Router();
adminRouter.use(qbAdminSubscriptionsRouter);
adminRouter.use(qbAdminRouter);
router.use("/qb/admin", requireAuth, requireOperator, adminRouter);
const notificationPrefLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." },
});
router.use("/qb/notifications", notificationPrefLimiter, qbNotificationsRouter);

export default router;
