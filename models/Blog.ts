import { Schema, model, models } from "mongoose";

const BlogSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    markdown: { type: String, default: "" },
    thumbnail: { type: String, default: "" },
    tags: { type: [String], default: [] },
    categories: { type: [String], default: [] },
    published: { type: Boolean, default: true },
    scheduledFor: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    readingTimeMinutes: { type: Number, default: 1 },
    relatedSlugs: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    updatedAt: { type: String, default: "" },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

export const Blog = models.Blog || model("Blog", BlogSchema);
