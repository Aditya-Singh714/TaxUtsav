import express from "express";
import Order from "../models/Order.js";
import authMiddleware from "../middlewares/authMiddleware.js"; // Import your auth middleware

const router = express.Router();

// Protected route to create order
router.post("/create-order", authMiddleware, async (req, res) => {
  try {
    const { description, quantity, price } = req.body;

    // Basic validation
    if (!description || !quantity || !price) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create order and link it to logged-in user
    const order = await Order.create({
      description,
      quantity,
      price,
      user: req.user._id,
    });

    // Populate user name in response
    const populatedOrder = await order.populate("user", "name");

    res.status(201).json({
      message: "Order created successfully",
      order: {
        user: req.user.user_name,
        id: populatedOrder._id,
        description: populatedOrder.description,
        quantity: populatedOrder.quantity,
        price: populatedOrder.price,
        createdAt: populatedOrder.createdAt,
      },
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
