import { Schema, model, models } from "mongoose";

const ThemeSettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "primary", index: true },
    primaryColor: { type: String, default: "#2563eb" },
    accentColor: { type: String, default: "#14b8a6" },
    fontFamily: { type: String, default: "Inter" },
    radius: { type: String, default: "1.5rem" },
    themeMode: { type: String, enum: ["light", "dark", "system"], default: "dark" },
    animations: { type: String, enum: ["minimal", "smooth", "rich"], default: "smooth" },
    updatedAt: { type: String, default: "" },
  },
  { timestamps: true, minimize: false }
);

export const ThemeSettings = models.ThemeSettings || model("ThemeSettings", ThemeSettingsSchema);
