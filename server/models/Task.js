import mongoose from "mongoose";

const completionSchema = new mongoose.Schema(
  {
    date: { type: String, required: true }, // YYYY-MM-DD in user's selected timezone
    status: {
      type: String,
      enum: ["completed", "cheat", "freeze"],
      required: true
    },
    note: { type: String, default: "" }
  },
  { _id: false }
);

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    module: { type: mongoose.Schema.Types.ObjectId, ref: "Module", required: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 500, default: "" },
    targetDays: { type: Number, required: true, min: 1, max: 3650 },
    active: { type: Boolean, default: true },
    completions: { type: [completionSchema], default: [] },
    longestStreak: { type: Number, default: 0 }
  },
  { timestamps: true }
);

taskSchema.index({ user: 1, module: 1 });

export default mongoose.model("Task", taskSchema);
