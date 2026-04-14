import express from "express";
import {
  getFinalReviewDocs,
  getFinalReviewDocById,
  approveFinal,
  rejectFinal,
} from "../controllers/finalReviewController.js";

import { requireAuth1 } from "../middleware/auth.js";
import { requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(requireAuth1);
router.use(requireRole(["FinalReview", "admin", "SuperAdmin"]));

router.get("/", getFinalReviewDocs);
router.get("/:id", getFinalReviewDocById);
router.put("/:id/approve", approveFinal);
router.put("/:id/reject", rejectFinal);

export default router;
