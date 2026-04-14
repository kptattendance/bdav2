import Document from "../models/Document.js";
import User from "../models/User.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

// 🔹 GET RFID LIST
export const getRFIDDocuments = async (req, res) => {
  try {
    const docs = await Document.find({
      status: "RFID_TAGGED",
    })
      .populate("rfidTaggedBy", "firstName lastName email phone profileImage")
      .sort({ createdAt: -1 });

    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 GET SINGLE DOC
export const getDocumentById = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id).populate(
      "rfidTaggedBy",
      "firstName lastName email phone profileImage"
    );

    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image required" });
    }

    const result = await uploadToCloudinary(req.file.buffer, "rfid");

    const {
      rfid,
      department,
      subDepartment,
      fileName,
      fileSubject,
      fileDescription,
      fileYear,
      fileSharedBy,
    } = req.body;

    if (!rfid || !department || !subDepartment || !fileName) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    // 🔥 FIX: get Mongo user
    const user = await User.findOne({ clerkId: req.userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const doc = await Document.create({
      rfid,
      department,
      subDepartment,
      fileName,
      fileSubject,
      fileDescription,
      fileYear,
      fileSharedBy,

      rfidTaggedBy: user._id, // ✅ FIXED
      coverImage: result.secure_url,

      status: "RFID_TAGGED",
    });

    res.json(doc);
  } catch (err) {
    console.error("RFID ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
// 🔹 UPDATE METADATA
export const updateRFIDDocument = async (req, res) => {
  try {
    const updated = await Document.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        status: "FILE_PREPARED",
      },
      { new: true },
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
