import express from "express";
import {
  getRFIDTaggedDocs,
  getSingleDoc,
  prepareFile,
} from "../controllers/filePreparationController.js";

import { requireAuth1 } from "../middleware/auth.js";
import { requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 Only File Preparation role allowed
router.use(requireAuth1);
router.use(requireRole(["FilePreparation", "admin", "SuperAdmin"]));

// 🔹 GET list
router.get("/", getRFIDTaggedDocs);

// 🔹 GET single
router.get("/:id", getSingleDoc);

// 🔹 UPDATE → mark prepared
router.put("/:id", prepareFile);

export default router;
