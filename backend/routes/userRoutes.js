import express from "express";
import { createUser } from "../controllers/userController.js";
import { upload } from "../config/multer.js";

const router = express.Router();

router.post("/", upload.single("image"), createUser);

export default router;
