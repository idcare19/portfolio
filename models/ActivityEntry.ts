import { Schema, model, models } from "mongoose";

const ActivityEntrySchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    details: { type: String, default: "" },
    type: { type: String, default: "update", index: true },
    occurredAt: { type: String, required: true, index: true },
    href: { type: String, default: "" },
    updatedAt: { type: String, default: "" },
  },
  { timestamps: true, minimize: false }
);

export const ActivityEntry = models.ActivityEntry || model("ActivityEntry", ActivityEntrySchema);
