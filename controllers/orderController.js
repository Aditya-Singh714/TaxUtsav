import Order from "../models/Order.js";
import crypto from "crypto";
import razorpay from "../utils/razorpay.js";

// ============================
// ✅ Create Razorpay Order
// ============================
export const createOrder = async (req, res) => {
  try {
    const { items, paymentMethod } = req.body;
    const userId = req.user.userId;

    const amount = items.reduce(
      (total, item) => total + item.price * (item.quantity || 1),
      0
    );

    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    const order = await Order.create({
      userId,
      items,
      paymentMethod,
      razorpay_order_id: razorpayOrder.id,
      isPaid: false,
    });

    res.status(201).json({
      message: "Order created",
      order: {
        localOrderId: order._id,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
    });
  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({ message: "Failed to create order" });
  }
};

// ============================
// ✅ Get Orders (Optional: Filter by status)
// ============================
export const getOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const query = req.query.status
      ? { userId, status: req.query.status }
      : { userId };

    const orders = await Order.find(query);
    res.json(orders);
  } catch (err) {
    console.error("Get Orders Error:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// ============================
// ✅ Verify Razorpay Payment
// ============================
export const verifyPayment = async (req, res) => {
  try {
    const {
      orderId, // local MongoDB order _id
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // 🔐 Generate expected signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    console.log(expectedSignature);
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // ✅ Update order status in DB
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.razorpay_order_id = razorpay_order_id;
    order.razorpay_payment_id = razorpay_payment_id;
    order.razorpay_signature = razorpay_signature;
    order.isPaid = true;

    await order.save();

    res.json({ message: "Payment verified successfully", order });
  } catch (err) {
    console.error("Verify Payment Error:", err);
    res.status(500).json({ message: "Payment verification failed" });
  }
};
