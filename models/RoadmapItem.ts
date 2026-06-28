import { Schema, model, models } from "mongoose";

const RoadmapItemSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    status: { type: String, enum: ["completed", "in-progress", "planned"], default: "planned", index: true },
    eta: { type: String, default: "" },
    tags: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    updatedAt: { type: String, default: "" },
  },
  { timestamps: true, minimize: false }
);

export const RoadmapItem = models.RoadmapItem || model("RoadmapItem", RoadmapItemSchema);
