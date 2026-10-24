import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { listFreezes, createFreeze } from "../controllers/freezeController.js";

const router = Router();
router.use(auth);
router.get("/", listFreezes);
router.post("/", createFreeze);

export default router;
