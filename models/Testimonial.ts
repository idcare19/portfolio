import { Schema, model, models } from "mongoose";

const TestimonialSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    clientName: { type: String, required: true },
    roleCompany: { type: String, default: "" },
    message: { type: String, default: "" },
    image: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    updatedAt: { type: String, default: "" },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

export const Testimonial = models.Testimonial || model("Testimonial", TestimonialSchema);
