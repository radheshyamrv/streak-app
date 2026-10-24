import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { listModules, createModule, updateModule, deleteModule } from "../controllers/moduleController.js";

const router = Router();
router.use(auth);
router.get("/", listModules);
router.post("/", createModule);
router.patch("/:id", updateModule);
router.delete("/:id", deleteModule);

export default router;
