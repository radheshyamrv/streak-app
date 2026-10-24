import mongoose from "mongoose";

const cheatDaySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    date: { type: String, required: true },
    blockNumber: { type: Number, required: true }
  },
  { timestamps: true }
);

cheatDaySchema.index({ user: 1, task: 1, date: 1 }, { unique: true });

export default mongoose.model("CheatDay", cheatDaySchema);
