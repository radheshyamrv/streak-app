import mongoose from "mongoose";

const dailyChallengeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    challenge: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge", required: true },
    date: { type: String, required: true },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
    note: { type: String, default: "" }
  },
  { timestamps: true }
);

dailyChallengeSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model("DailyChallenge", dailyChallengeSchema);
