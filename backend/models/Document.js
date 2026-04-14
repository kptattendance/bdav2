import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    rfid: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    coverImage: String,
    department: {
      type: String,
      required: true,
    },

    subDepartment: {
      type: String,
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    fileDescription: String,
    fileSubject: String,

    fileYear: Number,

    // 🔥 MAIN DATES
    receivedDate: {
      type: Date,
      default: Date.now,
    },

    fileSharedBy: String,

    // 🔥 WORKFLOW USERS + DATES

    rfidTaggedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rfidTaggedAt: {
      type: Date,
      default: Date.now,
    },

    filePreparedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    filePreparedAt: Date,

    notePages: Number,
    mainPages: Number,
    coverPages: Number,
    pageNumberedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    pageNumberedAt: Date,

    scannedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    scannedAt: Date,

    qualityCheckedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    qualityCheckedAt: Date,

    metadataAddedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    metadataAddedAt: Date,

rejectionReason: String,
rejectedToStage: String,
rejectedToUser: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
},

    finalApprovedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    finalApprovedAt: Date,

    status: {
      type: String,
      enum: [
        "RFID_TAGGED",
        "FILE_PREPARED",
        "NUMBERED",
        "SCANNED",
        "QUALITY_CHECKED",
        "METADATA_ADDED",
        "APPROVED",
      ],
      default: "RFID_TAGGED",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Document", documentSchema);
