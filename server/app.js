import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import moduleRoutes from "./routes/moduleRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import freezeRoutes from "./routes/freezeRoutes.js";
import challengeRoutes from "./routes/challengeRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import { notFound, errorHandler } from "./middleware/error.js";

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL?.split(",") || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true, service: "streak-api" }));

app.use("/api/auth", authRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/freezes", freezeRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/history", historyRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
