import express from "express";
import dotenv from "dotenv";
import pool from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import { createVehicleTable } from "./models/vehicleModel.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Root route
app.get("/", (req, res) => {
  res.send("🚗 Vehicle Configurator API is running successfully!");
});

// ✅ Database connection + table creation
const connectDB = async () => {
  try {
    await pool.connect();
    console.log("✅ PostgreSQL connected successfully");

    // Create vehicle table if not exists
    await createVehicleTable();
  } catch (err) {
    console.error("❌ PostgreSQL connection failed:", err.message);
    process.exit(1);
  }
};

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);

// ✅ Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Server running on port ${PORT}`);
});
