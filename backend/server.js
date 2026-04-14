import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import rfidRoutes from "./routes/rfidRoutes.js";
import filePreparationRoutes from "./routes/filePreparationRoutes.js";
import numberingRoutes from "./routes/numberingRoutes.js";
import scanningRoutes from "./routes/scanningRoutes.js";
import qualityRoutes from "./routes/qualityRoutes.js";

import { clerkMiddleware } from "@clerk/express";

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Connect DB
connectDB();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());

// Clerk middleware
app.use(clerkMiddleware());

// Public route
app.get("/", (req, res) => {
  res.send("API Running...");
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/rfid", rfidRoutes);
app.use("/api/numbering", numberingRoutes);
app.use("/api/file-preparation", filePreparationRoutes);
app.use("/api/scanning", scanningRoutes);
app.use("/api/quality", qualityRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
