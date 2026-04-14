import Document from "../models/Document.js";

// 🔹 GET ALL (only QUALITY_CHECKED)
export const getMetadataDocs = async (req, res) => {
  try {
    const docs = await Document.find({ status: "QUALITY_CHECKED" })
      .populate("rfidTaggedBy", "firstName lastName phone profileImage")
      .populate("filePreparedBy", "firstName lastName phone profileImage")
      .populate("pageNumberedBy", "firstName lastName phone profileImage")
      .populate("scannedBy", "firstName lastName phone profileImage")
      .populate("qualityCheckedBy", "firstName lastName phone profileImage")
      .sort({ updatedAt: -1 });

    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching metadata docs", err });
  }
};

// 🔹 GET SINGLE
export const getMetadataDocById = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id)
      .populate("rfidTaggedBy", "firstName lastName phone profileImage")
      .populate("filePreparedBy", "firstName lastName phone profileImage")
      .populate("pageNumberedBy", "firstName lastName phone profileImage")
      .populate("scannedBy", "firstName lastName phone profileImage")
      .populate("qualityCheckedBy", "firstName lastName phone profileImage");

    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: "Error", err });
  }
};

// 🔹 SAVE METADATA
export const saveMetadata = async (req, res) => {
  try {
    const { fileSubject, fileYear } = req.body;

    const doc = await Document.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (doc.status !== "QUALITY_CHECKED") {
      return res.status(400).json({ message: "Invalid stage" });
    }

    // 🔥 metadata update
    doc.fileSubject = fileSubject;
    doc.fileYear = fileYear;

    doc.metadataAddedBy = req.dbUser._id;
    doc.metadataAddedAt = new Date();

    doc.status = "METADATA_ADDED";

    await doc.save();

    res.json({ message: "Metadata Saved ✅", doc });
  } catch (err) {
    console.error("METADATA ERROR:", err);
    res.status(500).json({ message: "Error saving metadata", err });
  }
};
