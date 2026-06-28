import { Schema, model, models } from "mongoose";

const ViewSchema = new Schema(
  {
    targetType: { type: String, required: true, index: true },
    targetSlug: { type: String, required: true, index: true },
    visitorId: { type: String, required: true, index: true },
    sessionId: { type: String, required: true },
    path: { type: String, default: "/" },
    occurredAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true, minimize: false }
);

ViewSchema.index({ targetType: 1, targetSlug: 1, visitorId: 1 }, { unique: true });

export const View = models.View || model("View", ViewSchema);
