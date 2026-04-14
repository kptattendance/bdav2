import Document from "../models/Document.js";
import User from "../models/User.js";

// 🔹 GET NUMBERED DOCS
export const getNumberedDocs = async (req, res) => {
  try {
    const docs = await Document.find({ status: "NUMBERED" })
      .populate("filePreparedBy", "firstName lastName phone profileImage")
      .populate("pageNumberedBy", "firstName lastName phone profileImage");

    res.json(docs);
  } catch (err) {
    res.status(500).json(err);
  }
};

// 🔹 GET SINGLE
export const getSingleScanDoc = async (req, res) => {
  const doc = await Document.findById(req.params.id)
    .populate("filePreparedBy", "firstName lastName")
    .populate("pageNumberedBy", "firstName lastName");

  res.json(doc);
};

// 🔹 SAVE SCANS
export const saveScans = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ clerkId: req.userId });

    const doc = await Document.findById(id);

    if (!doc) return res.status(404).json({ message: "Not found" });

    if (doc.status !== "NUMBERED") {
      return res.status(400).json({ message: "Invalid stage" });
    }

    const { noteFiles, mainFiles, coverFiles } = req.body;

    doc.noteFiles = noteFiles || [];
    doc.mainFiles = mainFiles || [];
    doc.coverFiles = coverFiles || [];

    doc.scannedBy = user._id;
    doc.scannedAt = new Date();

    doc.status = "SCANNED";

    await doc.save();

    res.json({ message: "Scanned successfully", doc });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};
