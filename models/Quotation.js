import mongoose from "mongoose";

const quotationSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  description: { type: String },
  amount: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  quotationDate: { type: Date, default: Date.now },
});

export default mongoose.model("Quotation", quotationSchema);
