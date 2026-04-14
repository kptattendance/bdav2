import express from "express";
import { requireAuth } from "@clerk/express";

import {
  createOrGetUser,
  getAllUsers,
  getMyProfile,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
} from "../controllers/userController.js";

import { requireRole } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import { requireAuth1 } from "../middleware/auth.js";
const router = express.Router();

// 🔹 Sync user on login
router.get("/sync", requireAuth1, createOrGetUser);
router.post(
  "/add",
  requireAuth1,
  // requireRole(["admin", "SuperAdmin"]),
  upload.single("image"),
  createUser,
);

// 🔹 Current user
router.get("/me", requireAuth1, getMyProfile);

// 🔹 admin routes
router.get(
  "/",
  requireAuth1,
  requireRole(["admin", "SuperAdmin", "Quality"]),
  getAllUsers,
);

router.get("/:id", requireAuth1, requireRole(["admin"]), getUserById);

router.put(
  "/:id",
  requireAuth1,
  requireRole(["admin", "SuperAdmin"]),
  upload.single("image"),
  updateUser,
);

router.delete(
  "/:id",
  requireAuth1,
  //requireRole(["admin", "SuperAdmin"]),
  deleteUser,
);

export default router;
