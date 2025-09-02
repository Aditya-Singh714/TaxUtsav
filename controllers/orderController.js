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
// ✅ Verify Payment (Redirect flow)
// ============================
export const verifyPaymentRedirect = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;

    // 🔐 Generate expected signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.redirect("/payment-failed"); // frontend route
    }

    // ✅ Update order status in DB
    const order = await Order.findOne({ razorpay_order_id });
    if (!order) {
      return res.redirect("/payment-failed");
    }

    order.isPaid = true;
    order.razorpay_payment_id = razorpay_payment_id;
    order.razorpay_signature = razorpay_signature;
    await order.save();

    return res.redirect(`/payment-success?orderId=${order._id}`);
  } catch (err) {
    console.error("Verify Payment Redirect Error:", err);
    res.redirect("/payment-failed");
  }
};

// ============================
// ✅ Get Orders (User’s Orders)
// ============================
export const getOrders = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Optional filter: ?status=paid / pending
    const query = req.query.status
      ? { userId, isPaid: req.query.status === "paid" }
      : { userId };

    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    console.error("Get Orders Error:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};
