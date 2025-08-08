import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import quotationRoutes from "./routes/quotationRoutes.js";

import cors from "cors";

dotenv.config();
connectDB();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/quotation", quotationRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(process.env.PORT || 8000, () =>
  console.log(`Server running on port ${process.env.PORT || 5000}`)
);

