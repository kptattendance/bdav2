import express from "express";
import { requireAuth } from "@clerk/express";
import upload from "../middleware/upload.js";

import {
  createDocument,
  getRFIDDocuments,
  getDocumentById,
  updateRFIDDocument,
} from "../controllers/rfidController.js";
import { requireAuth1 } from "../middleware/auth.js";

const router = express.Router();

// 📌 Get RFID documents (first stage)
router.get("/all", requireAuth1, getRFIDDocuments);

// 📌 Create new document (RFID step)
router.post("/", requireAuth1, upload.single("image"), createDocument);

// 📌 Get single document
router.get("/:id", requireAuth1, getDocumentById);

// 📌 Update RFID metadata
router.put("/:id", requireAuth1, updateRFIDDocument);

export default router;
