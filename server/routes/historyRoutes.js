import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { history } from "../controllers/historyController.js";

const router = Router();
router.use(auth);
router.get("/", history);

export default router;
