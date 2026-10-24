import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { getTodayChallenge, completeTodayChallenge, challengeHistory } from "../controllers/challengeController.js";

const router = Router();
router.use(auth);
router.get("/today", getTodayChallenge);
router.post("/today/complete", completeTodayChallenge);
router.get("/history", challengeHistory);

export default router;
