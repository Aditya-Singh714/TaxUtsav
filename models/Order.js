import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        name: String,
        description: String,
        quantity: Number,
        price: Number,
      },
    ],
    paymentMethod: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String,
    isPaid: { type: Boolean, default: false },
  },
  { timestamps: true }
); // ⏰ adds createdAt and updatedAt

export default mongoose.model("Order", orderSchema);
