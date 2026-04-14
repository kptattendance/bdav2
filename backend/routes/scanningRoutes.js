import express from "express";
import {
  getNumberedDocs,
  getSingleScanDoc,
  saveScans,
} from "../controllers/scanningController.js";

import { requireAuth1 } from "../middleware/auth.js";
import { requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(requireAuth1);
router.use(requireRole(["Scanning", "admin", "SuperAdmin"]));

router.get("/", getNumberedDocs);
router.get("/:id", getSingleScanDoc);
router.put("/:id", saveScans);

export default router;
