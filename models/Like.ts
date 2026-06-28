import { Schema, model, models } from "mongoose";

const LikeSchema = new Schema(
  {
    targetType: { type: String, required: true, index: true },
    targetSlug: { type: String, required: true, index: true },
    visitorId: { type: String, required: true, index: true },
    sessionId: { type: String, required: true },
    ipHash: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true, minimize: false }
);

LikeSchema.index({ targetType: 1, targetSlug: 1, visitorId: 1 }, { unique: true });

export const Like = models.Like || model("Like", LikeSchema);
