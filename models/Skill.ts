import { Schema, model, models } from "mongoose";

const SkillSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    category: { type: String, default: "Tools" },
    icon: { type: String, default: "" },
    level: { type: Number, default: 80 },
    summary: { type: String, default: "" },
    order: { type: Number, default: 0 },
    updatedAt: { type: String, default: "" },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

export const Skill = models.Skill || model("Skill", SkillSchema);
