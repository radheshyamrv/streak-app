import mongoose from "mongoose";

const freezeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    days: { type: Number, required: true, min: 1, max: 3 },
    reason: { type: String, required: true, trim: true, maxlength: 300 }
  },
  { timestamps: true }
);

freezeSchema.index({ user: 1, startDate: 1 });

export default mongoose.model("Freeze", freezeSchema);
