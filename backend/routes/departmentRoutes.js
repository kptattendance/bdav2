import express from "express";
import {
  getDepartmentDocs,
  getDepartmentDocById,
} from "../controllers/departmentController.js";

import { requireAuth1 } from "../middleware/auth.js";
import { requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(requireAuth1);
router.use(requireRole(["DepartmentUser", "admin", "SuperAdmin"]));

router.get("/", getDepartmentDocs);
router.get("/:id", getDepartmentDocById);

export default router;