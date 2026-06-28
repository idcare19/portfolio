import { Schema, model, models } from "mongoose";

const GitHubCacheSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    data: { type: Schema.Types.Mixed, required: true, default: {} },
    expiresAt: { type: Date, required: true, index: true },
    updatedAt: { type: String, default: "" },
  },
  { timestamps: true, minimize: false }
);

export const GitHubCache = models.GitHubCache || model("GitHubCache", GitHubCacheSchema);
