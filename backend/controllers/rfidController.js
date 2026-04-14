import Document from "../models/Document.js";
import User from "../models/User.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

// 🔹 GET RFID LIST
export const getRFIDDocuments = async (req, res) => {
  try {
    const docs = await Document.find({
      status: "RFID_TAGGED",
    }).sort({ createdAt: -1 });

    // 🔥 Attach user details
    const enrichedDocs = await Promise.all(
      docs.map(async (doc) => {
        const user = await User.findOne({
          clerkId: doc.rfidTaggedBy,
        });

        return {
          ...doc._doc,
          taggedUser: user
            ? {
                name: `${user.firstName} ${user.lastName || ""}`,
                email: user.email,
                phone: user.phone,
                image: user.profileImage,
              }
            : null,
        };
      }),
    );

    res.json(enrichedDocs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 GET SINGLE DOC
export const getDocumentById = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);

    const user = await User.findOne({
      clerkId: doc.rfidTaggedBy,
    });

    const enrichedDoc = {
      ...doc._doc,
      taggedUser: user
        ? {
            name: `${user.firstName} ${user.lastName || ""}`,
            email: user.email,
            phone: user.phone,
            image: user.profileImage,
          }
        : null,
    };

    res.json(enrichedDoc);
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

    // 🔥 VALIDATION (IMPORTANT)
    if (!rfid || !department || !subDepartment || !fileName) {
      return res.status(400).json({
        message: "Missing required fields",
        body: req.body,
      });
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

      rfidTaggedBy: req.userId,
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
