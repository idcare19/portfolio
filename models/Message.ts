import { Schema, model, models } from "mongoose";

const MessageSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, default: "Website Contact Form" },
    message: { type: String, required: true },
<<<<<<< HEAD
    ipAddress: { type: String, default: "", index: true },
=======
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
    read: { type: Boolean, default: false },
    status: { type: String, enum: ["unread", "read", "replied", "archived"], default: "unread", index: true },
    createdAt: { type: String, required: true },
    repliedAt: { type: String, default: "" },
    updatedAt: { type: String, default: "" },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

export const Message = models.Message || model("Message", MessageSchema);
