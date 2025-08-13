import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    description: { type: String },
    amount: { type: Number },
    discount: { type: Number },
    tax: { type: Number },
    totalAmount: { type: Number },
    message: { type: String, required: true },
    reply: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);
