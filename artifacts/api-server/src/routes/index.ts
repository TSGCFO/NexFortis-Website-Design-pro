import { Router, type IRouter } from "express";
import healthRouter from "./health";
import blogRouter from "./blog";
import qbPortalRouter from "./qb-portal";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/blog", blogRouter);
router.use("/qb", qbPortalRouter);

export default router;
