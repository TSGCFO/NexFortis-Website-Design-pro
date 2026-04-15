import { Router, type IRouter } from "express";
import rateLimit from "express-rate-limit";
import healthRouter from "./health";
import blogRouter from "./blog";
import contactRouter from "./contact";
import qbPortalRouter from "./qb-portal";

const router: IRouter = Router();

const checkoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." },
});

const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." },
});

const ticketLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
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
router.post("/qb/orders/:id/files", orderLimiter);
router.post("/qb/support-tickets", ticketLimiter);
router.use("/qb", qbPortalRouter);

export default router;
