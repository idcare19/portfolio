import { Schema, model, models } from "mongoose";

const ProjectSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    shortDescription: { type: String, default: "" },
    longDescription: { type: String, default: "" },
    image: { type: String, default: "" },
    category: { type: String, default: "" },
    techStack: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ["published", "draft"], default: "published" },
    overview: { type: String, default: "" },
    problem: { type: String, default: "" },
    solution: { type: String, default: "" },
    myRole: { type: String, default: "" },
    responsibilities: { type: [String], default: [] },
    features: { type: [String], default: [] },
    screenshots: { type: [String], default: [] },
    architectureDiagram: { type: String, default: "" },
    databaseSchema: { type: String, default: "" },
    apiFlow: { type: String, default: "" },
    folderStructure: { type: String, default: "" },
    challenges: { type: String, default: "" },
    lessonsLearned: { type: String, default: "" },
    futureImprovements: { type: [String], default: [] },
    timeline: { type: String, default: "" },
    tags: { type: [String], default: [] },
    readingTimeMinutes: { type: Number, default: 1 },
    outcome: { type: String, default: "" },
    liveDemoUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    updatedAt: { type: String, default: "" },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

export const Project = models.Project || model("Project", ProjectSchema);
