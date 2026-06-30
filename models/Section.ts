import { Schema, model, models } from "mongoose";

const SectionSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    content: { type: String, default: "" },
    items: { type: [Schema.Types.Mixed], default: [] },
    isEnabled: { type: Boolean, default: true },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    renderer: { type: String, required: true },
    template: { type: String, default: "" },
    layout: { type: String, default: "default" },
    label: { type: String, default: "" },
    showOnHomepage: { type: Boolean, default: true },
    nav: { type: Schema.Types.Mixed, default: null },
    settings: { type: Schema.Types.Mixed, default: {} },
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
