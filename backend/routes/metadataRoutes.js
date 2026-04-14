import express from "express";
import {
  getMetadataDocs,
  getMetadataDocById,
  saveMetadata,
} from "../controllers/metadataController.js";

import { requireAuth1 } from "../middleware/auth.js";
import { requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(requireAuth1);
router.use(requireRole(["Metadata", "admin", "SuperAdmin"]));

router.get("/", getMetadataDocs);
router.get("/:id", getMetadataDocById);
router.put("/:id", saveMetadata);

export default router;
