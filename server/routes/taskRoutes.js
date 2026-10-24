import { Router } from "express";
import { auth } from "../middleware/auth.js";
import {
  listTasks, createTask, updateTask, deleteTask, completeTask, useCheatDay
} from "../controllers/taskController.js";

const router = Router();
router.use(auth);
router.get("/", listTasks);
router.post("/", createTask);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);
router.post("/:id/complete", completeTask);
router.post("/:id/cheat", useCheatDay);

export default router;
