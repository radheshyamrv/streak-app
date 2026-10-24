import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { dashboard } from "../controllers/dashboardController.js";

const router = Router();
router.use(auth);
router.get("/", dashboard);

export default router;
