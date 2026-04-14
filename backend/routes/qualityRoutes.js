import express from "express";
import {
  getQualityDocs,
  getQualityDocById,
  approveDocument,
  rejectDocument,
} from "../controllers/qualityController.js";

import { requireAuth1 } from "../middleware/auth.js";
import { requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔐 AUTH + ROLE (QUALITY USERS ONLY)
router.use(requireAuth1);
router.use(requireRole(["Quality", "admin", "SuperAdmin"]));

// 📄 GET ALL SCANNED DOCS
router.get("/", getQualityDocs);

// 📄 GET SINGLE DOC
router.get("/:id", getQualityDocById);

// ✅ APPROVE
router.put("/:id/approve", approveDocument);

// ❌ REJECT
router.put("/:id/reject", rejectDocument);

export default router;
