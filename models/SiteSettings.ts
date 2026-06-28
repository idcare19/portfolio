import { Schema, model, models } from "mongoose";

const SiteSettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "primary", index: true },
    owner: { type: Schema.Types.Mixed, default: {} },
    nav: { type: [Schema.Types.Mixed], default: [] },
    socials: { type: [Schema.Types.Mixed], default: [] },
    websiteSettings: { type: Schema.Types.Mixed, default: {} },
    websiteControl: { type: Schema.Types.Mixed, default: {} },
<<<<<<< HEAD
    shell: { type: Schema.Types.Mixed, default: {} },
    githubConfig: { type: Schema.Types.Mixed, default: {} },
=======
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
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
