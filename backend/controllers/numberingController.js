import Document from "../models/Document.js";
import User from "../models/User.js";

// 🔹 GET FILE PREPARED DOCS
export const getPreparedDocs = async (req, res) => {
  try {
    const docs = await Document.find({ status: "FILE_PREPARED" })
      .populate("rfidTaggedBy", "firstName lastName phone profileImage")
      .populate("filePreparedBy", "firstName lastName phone profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json(docs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching docs", err });
  }
};

// 🔹 GET SINGLE
export const getSingleNumberingDoc = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id)
      .populate("rfidTaggedBy", "firstName lastName phone profileImage")
      .populate("filePreparedBy", "firstName lastName phone profileImage");

    res.status(200).json(doc);
  } catch (err) {
    res.status(500).json({ message: "Error fetching doc", err });
  }
};

// 🔹 SAVE NUMBERING
export const saveNumbering = async (req, res) => {
  try {
    const { id } = req.params;
    const { notePages, mainPages, coverPages } = req.body;

    const user = await User.findOne({ clerkId: req.userId });

    const doc = await Document.findById(id);

    if (!doc) return res.status(404).json({ message: "Doc not found" });

    if (doc.status !== "FILE_PREPARED") {
      return res.status(400).json({ message: "Invalid stage" });
    }

    // ✅ update
    doc.notePages = notePages;
    doc.mainPages = mainPages;
    doc.coverPages = coverPages;

    doc.pageNumberedBy = user._id;
    doc.pageNumberedAt = new Date();

    doc.status = "NUMBERED";

    await doc.save();

    res.json({ message: "Numbering done", doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error numbering", err });
  }
};
