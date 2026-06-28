import { Schema, model, models, type InferSchemaType } from "mongoose";

const SiteDataDocumentSchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      default: "primary",
      index: true,
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
    meta: {
      type: new Schema(
        {
          lastMongoUpdateAt: { type: String, default: "" },
          lastGitHubSyncAt: { type: String, default: "" },
        },
        { _id: false }
      ),
      default: () => ({}),
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

export type SiteDataDocumentModel = InferSchemaType<typeof SiteDataDocumentSchema>;

export const SiteDataDocument =
  models.SiteDataDocument || model("SiteDataDocument", SiteDataDocumentSchema);
