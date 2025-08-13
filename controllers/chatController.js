import Chat from "../models/Chat.js";
import User from "../models/User.js";

// ✅ Send Message
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // Get logged-in user
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Example fixed values (replace with DB or calculation logic if needed)
    const amount = 1000;
    const discount = 100;
    const tax = 50;
    const totalAmount = amount - discount + tax;

    // Auto reply based on message
    let reply = "";
    switch (message.toLowerCase()) {
      case "discount":
        reply = `Your discount is ${discount}`;
        break;
      case "amount":
        reply = `Your amount is ${amount}`;
        break;
      case "tax":
        reply = `Your tax is ${tax}`;
        break;
      case "totalamount":
        reply = `Your total amount is ${totalAmount}`;
        break;
      case "email":
        reply = `Your email is ${user.email}`;
        break;
      case "name":
        reply = `Your name is ${user.user_name}`;
        break;
      default:
        reply = `Hi ${user.user_name || "there"}! How can I help you today?`;
    }

    // Save chat in DB
    const chat = await Chat.create({
      user: user._id,
      name: user.user_name,
      email: user.email,
      phone: user.phone || "",
      description: user.description || "",
      amount,
      discount,
      tax,
      totalAmount,
      message,
      reply,
    });

    // Send response
    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: chat,
    });
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get Chat List
export const getChatList = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user.userId })
      .sort({ createdAt: -1 })
      .populate("user", "user_name email phone");

    res.json({
      success: true,
      total: chats.length,
      data: chats,
    });
  } catch (error) {
    console.error("Error in getChatList:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
