import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, trim: true, maxlength: 300, default: "" },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

moduleSchema.index({ user: 1, name: 1 }, { unique: true });

export default mongoose.model("Module", moduleSchema);
