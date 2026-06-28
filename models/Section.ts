import { Schema, model, models } from "mongoose";

const SectionSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    content: { type: String, default: "" },
    items: { type: [Schema.Types.Mixed], default: [] },
    isEnabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    renderer: { type: String, required: true },
    layout: { type: String, default: "default" },
    label: { type: String, default: "" },
    nav: { type: Schema.Types.Mixed, default: null },
    ctaButtons: { type: [Schema.Types.Mixed], default: [] },
    data: { type: Schema.Types.Mixed, default: {} },
    updatedAt: { type: String, default: "" },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

export const Section = models.Section || model("Section", SectionSchema);
