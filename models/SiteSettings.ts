import { Schema, model, models } from "mongoose";

const SiteSettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "primary", index: true },
    owner: { type: Schema.Types.Mixed, default: {} },
    nav: { type: [Schema.Types.Mixed], default: [] },
    socials: { type: [Schema.Types.Mixed], default: [] },
    websiteSettings: { type: Schema.Types.Mixed, default: {} },
    websiteControl: { type: Schema.Types.Mixed, default: {} },
    shell: { type: Schema.Types.Mixed, default: {} },
    githubConfig: { type: Schema.Types.Mixed, default: {} },
    heroTech: { type: [String], default: [] },
    learningPhase: { type: [String], default: [] },
    collaboration: { type: Schema.Types.Mixed, default: {} },
    siteConnection: { type: Schema.Types.Mixed, default: null },
    mediaLibrary: { type: [Schema.Types.Mixed], default: [] },
    services: { type: [Schema.Types.Mixed], default: [] },
    completedProjects: { type: [Schema.Types.Mixed], default: [] },
    education: { type: [Schema.Types.Mixed], default: [] },
    extra: { type: Schema.Types.Mixed, default: {} },
    updatedAt: { type: String, default: "" },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

export const SiteSettings = models.SiteSettings || model("SiteSettings", SiteSettingsSchema);