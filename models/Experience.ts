import { Schema, model, models } from "mongoose";

const ExperienceSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    role: { type: String, required: true },
    company: { type: String, default: "" },
    period: { type: String, default: "" },
    summary: { type: String, default: "" },
    highlights: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    updatedAt: { type: String, default: "" },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

export const Experience = models.Experience || model("Experience", ExperienceSchema);
