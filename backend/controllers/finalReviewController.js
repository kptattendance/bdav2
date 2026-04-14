import Document from "../models/Document.js";

// 🔹 GET ALL (only METADATA_ADDED)
export const getFinalReviewDocs = async (req, res) => {
  try {
    const docs = await Document.find({ status: "METADATA_ADDED" })
      .populate("rfidTaggedBy", "firstName lastName phone profileImage")
      .populate("filePreparedBy", "firstName lastName phone profileImage")
      .populate("pageNumberedBy", "firstName lastName phone profileImage")
      .populate("scannedBy", "firstName lastName phone profileImage")
      .populate("qualityCheckedBy", "firstName lastName phone profileImage")
      .populate("metadataAddedBy", "firstName lastName phone profileImage")
      .sort({ updatedAt: -1 });

    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching final review docs", err });
  }
};

// 🔹 GET SINGLE
export const getFinalReviewDocById = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id)
      .populate("rfidTaggedBy", "firstName lastName phone profileImage")
      .populate("filePreparedBy", "firstName lastName phone profileImage")
      .populate("pageNumberedBy", "firstName lastName phone profileImage")
      .populate("scannedBy", "firstName lastName phone profileImage")
      .populate("qualityCheckedBy", "firstName lastName phone profileImage")
      .populate("metadataAddedBy", "firstName lastName phone profileImage");

    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: "Error", err });
  }
};

// 🔹 APPROVE (FINAL APPROVAL)
export const approveFinal = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (doc.status !== "METADATA_ADDED") {
      return res.status(400).json({ message: "Invalid stage" });
    }

    doc.finalApprovedBy = req.dbUser._id;
    doc.finalApprovedAt = new Date();

    doc.status = "APPROVED";

    await doc.save();

    res.json({ message: "Final Approved ✅", doc });
  } catch (err) {
    console.error("FINAL APPROVE ERROR:", err);
    res.status(500).json({ message: "Error approving", err });
  }
};

// 🔹 REJECT (send back to metadata stage)
export const rejectFinal = async (req, res) => {
  try {
    const { reason } = req.body;

    const doc = await Document.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    // 🔥 store rejection
    doc.rejectionReason = reason;
    doc.rejectedToStage = "METADATA_ADDED";

    // 🔥 reset final approval
    doc.finalApprovedBy = null;
    doc.finalApprovedAt = null;

    // 🔥 go back to metadata stage
    doc.status = "METADATA_ADDED";

    await doc.save();

    res.json({ message: "Rejected to Metadata", doc });
  } catch (err) {
    console.error("FINAL REJECT ERROR:", err);
    res.status(500).json({ message: "Error rejecting", err });
  }
};
