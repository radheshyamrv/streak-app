import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["attention", "delayed-gratification", "digital-control", "discipline", "discomfort"],
      required: true
    },
    difficulty: {
      type: String,
      enum: ["medium", "hard"],
      required: true
    },
    durationMinutes: { type: Number, required: true, min: 5 },
    rules: [{ type: String }],
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Challenge", challengeSchema);
