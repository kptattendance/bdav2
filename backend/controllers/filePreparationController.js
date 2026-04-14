import Document from "../models/Document.js";
import User from "../models/User.js";

export const getRFIDTaggedDocs = async (req, res) => {
  try {
    const docs = await Document.find({ status: "RFID_TAGGED" }).sort({
      createdAt: -1,
    });

    // 🔥 attach user details
    const enrichedDocs = await Promise.all(
      docs.map(async (doc) => {
        const user = await User.findOne({
          clerkId: doc.rfidTaggedBy,
        });

        return {
          ...doc._doc,

          rfidTaggedByUser: user
            ? {
                name: `${user.firstName} ${user.lastName || ""}`,
                phone: user.phone,
                image: user.profileImage,
              }
            : null,
        };
      }),
    );

    res.status(200).json(enrichedDocs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching documents", error });
  }
};
// 🔹 2. GET SINGLE DOCUMENT
export const getSingleDoc = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    const user = await User.findOne({
      clerkId: doc.rfidTaggedBy,
    });

    const response = {
      ...doc._doc,
      rfidTaggedByUser: user
        ? {
            name: `${user.firstName} ${user.lastName || ""}`,
            phone: user.phone,
            image: user.profileImage,
          }
        : null,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error fetching document", error });
  }
};

// 🔹 3. UPDATE → FILE PREPARATION DONE
export const prepareFile = async (req, res) => {
  try {
    console.log("BODY:", req.body); // DEBUG

    const { id } = req.params;
    const clerkUserId = req.userId;

    const user = await User.findOne({ clerkId: clerkUserId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const doc = await Document.findById(id);

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (doc.status !== "RFID_TAGGED") {
      return res.status(400).json({
        message: "Document is not in RFID_TAGGED stage",
      });
    }

    // ✅ HANDLE DATE FROM FRONTEND
    let preparedDate;

    if (req.body.filePreparedAt && req.body.filePreparedAt !== "") {
      preparedDate = new Date(req.body.filePreparedAt);
    } else {
      return res.status(400).json({
        message: "File Prepared Date is required",
      });
    }

    // ❗ validate date
    if (isNaN(preparedDate.getTime())) {
      return res.status(400).json({
        message: "Invalid date format",
      });
    }

    // 🔥 update
    doc.filePreparedBy = user._id;
    doc.filePreparedAt = preparedDate;

    if (req.body.fileDescription) {
      doc.fileDescription = req.body.fileDescription;
    }

    doc.status = "FILE_PREPARED";

    await doc.save();

    res.status(200).json({
      message: "File prepared successfully",
      document: doc,
    });
  } catch (error) {
    console.error("ERROR:", error); // VERY IMPORTANT
    res.status(500).json({ message: "Error preparing file", error });
  }
};
