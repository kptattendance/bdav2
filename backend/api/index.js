import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import rfidRoutes from "./routes/rfidRoutes.js";
import filePreparationRoutes from "./routes/filePreparationRoutes.js";
import numberingRoutes from "./routes/numberingRoutes.js";
import scanningRoutes from "./routes/scanningRoutes.js";
import qualityRoutes from "./routes/qualityRoutes.js";
import metadataRoutes from "./routes/metadataRoutes.js";
import finalReviewRoutes from "./routes/finalReviewRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";

import { clerkMiddleware } from "@clerk/express";

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Connect DB
app.use(
  cors({
    origin: ["http://localhost:3000", "https://bdapro.vercel.app"],
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
app.use("/api/metadata", metadataRoutes);
app.use("/api/final-review", finalReviewRoutes);
app.use("/api/department", departmentRoutes);
// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}
