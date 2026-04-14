import Document from "../models/Document.js";
import User from "../models/User.js";

export const getQualityDocs = async (req, res) => {
  try {
    const docs = await Document.find({ status: "SCANNED" })
      .populate("rfidTaggedBy", "firstName lastName phone profileImage")
      .populate("filePreparedBy", "firstName lastName phone profileImage")
      .populate("pageNumberedBy", "firstName lastName phone profileImage")
      .populate("scannedBy", "firstName lastName phone profileImage")
      .populate("qualityCheckedBy", "firstName lastName phone profileImage")
      .sort({ updatedAt: -1 });

    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching docs", err });
  }
};

export const getQualityDocById = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id)
      .populate("rfidTaggedBy", "firstName lastName phone profileImage")
      .populate("filePreparedBy", "firstName lastName phone profileImage")
      .populate("pageNumberedBy", "firstName lastName phone profileImage")
      .populate("scannedBy", "firstName lastName phone profileImage")
      .populate("qualityCheckedBy", "firstName lastName phone profileImage");

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error", err });
  }
};

export const approveDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (!req.dbUser) {
      return res.status(400).json({ message: "User not found" });
    }

    // ✅ QUALITY CHECK
    doc.qualityCheckedBy = req.dbUser._id;
    doc.qualityCheckedAt = new Date();

    doc.status = "QUALITY_CHECKED";

    await doc.save();

    res.json({ message: "Quality Checked ✅", doc });
  } catch (err) {
    console.error("QUALITY APPROVE ERROR:", err);
    res.status(500).json({ message: "Error approving", err });
  }
};

export const rejectDocument = async (req, res) => {
  try {
    const { reason, sendToStage, sendToUser } = req.body;

    const doc = await Document.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    // 🔥 store rejection
    doc.rejectionReason = reason;
    doc.rejectedToStage = sendToStage;
    doc.rejectedToUser = sendToUser;

    // 🔥 RESET LOGIC (VERY IMPORTANT)

    if (sendToStage === "RFID_TAGGED") {
      doc.filePreparedBy = null;
      doc.filePreparedAt = null;

      doc.pageNumberedBy = null;
      doc.pageNumberedAt = null;

      doc.scannedBy = null;
      doc.scannedAt = null;

      doc.noteFiles = [];
      doc.mainFiles = [];
      doc.coverFiles = [];

      doc.qualityCheckedBy = null;
      doc.qualityCheckedAt = null;
    }

    if (sendToStage === "FILE_PREPARED") {
      doc.pageNumberedBy = null;
      doc.pageNumberedAt = null;

      doc.scannedBy = null;
      doc.scannedAt = null;

      doc.noteFiles = [];
      doc.mainFiles = [];
      doc.coverFiles = [];

      doc.qualityCheckedBy = null;
      doc.qualityCheckedAt = null;
    }

    if (sendToStage === "NUMBERED") {
      doc.scannedBy = null;
      doc.scannedAt = null;

      doc.noteFiles = [];
      doc.mainFiles = [];
      doc.coverFiles = [];

      doc.qualityCheckedBy = null;
      doc.qualityCheckedAt = null;
    }

    if (sendToStage === "SCANNED") {
      doc.qualityCheckedBy = null;
      doc.qualityCheckedAt = null;
    }

    // 🔥 UPDATE STATUS
    doc.status = sendToStage;

    await doc.save();

    res.json({ message: "Rejected & Rolled Back", doc });
  } catch (err) {
    console.error("REJECT ERROR:", err); // 🔥 ADD THIS
    res.status(500).json({ message: "Error rejecting", err });
  }
};
