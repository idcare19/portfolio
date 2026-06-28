import { Schema, model, models } from "mongoose";

const AnalyticsEventSchema = new Schema(
  {
    eventType: { type: String, required: true, index: true },
    path: { type: String, default: "/", index: true },
    targetType: { type: String, default: "" },
    targetSlug: { type: String, default: "", index: true },
    sessionId: { type: String, required: true, index: true },
    visitorId: { type: String, required: true, index: true },
    fingerprint: { type: String, default: "" },
    referrer: { type: String, default: "" },
    userAgent: { type: String, default: "" },
    metadata: { type: Schema.Types.Mixed, default: {} },
    occurredAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true, minimize: false }
);

AnalyticsEventSchema.index({ occurredAt: -1, eventType: 1 });

export const AnalyticsEvent = models.AnalyticsEvent || model("AnalyticsEvent", AnalyticsEventSchema);
