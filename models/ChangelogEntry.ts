import { Schema, model, models } from "mongoose";

const ChangelogEntrySchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    version: { type: String, required: true },
    title: { type: String, required: true },
    summary: { type: String, default: "" },
    bullets: { type: [String], default: [] },
    publishedAt: { type: String, required: true, index: true },
    updatedAt: { type: String, default: "" },
  },
  { timestamps: true, minimize: false }
);

export const ChangelogEntry = models.ChangelogEntry || model("ChangelogEntry", ChangelogEntrySchema);
