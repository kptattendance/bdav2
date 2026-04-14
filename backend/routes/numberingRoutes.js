import express from "express";
import {
  getPreparedDocs,
  getSingleNumberingDoc,
  saveNumbering,
} from "../controllers/numberingController.js";

import { requireAuth1 } from "../middleware/auth.js";
import { requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(requireAuth1);
router.use(requireRole(["Numbering", "admin", "SuperAdmin"]));

router.get("/", getPreparedDocs);
router.get("/:id", getSingleNumberingDoc);
router.put("/:id", saveNumbering);

export default router;
