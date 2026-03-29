import { Router, type IRouter } from "express";
import healthRouter from "./health";
import blogRouter from "./blog";
import contactRouter from "./contact";
import qbPortalRouter from "./qb-portal";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/blog", blogRouter);
router.use("/contact", contactRouter);
router.use("/qb", qbPortalRouter);

export default router;
