import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    // 🔹 BASIC INFO
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

    fileSharedBy: String, // (can convert to ObjectId later if needed)

    // 🔹 MAIN DATE
    receivedDate: {
      type: Date,
      default: Date.now,
    },

    // 🔥 RFID STAGE
    rfidTaggedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rfidTaggedAt: {
      type: Date,
      default: Date.now,
    },

    // 🔥 FILE PREPARATION
    filePreparedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    filePreparedAt: Date,

    // 🔥 NUMBERING
    notePages: Number,
    mainPages: Number,
    coverPages: Number,

    pageNumberedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    pageNumberedAt: Date,

    // 🔥 SCANNING
    scannedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    scannedAt: Date,

    noteFiles: [String],
    mainFiles: [String],
    coverFiles: [String],

    // 🔥 QUALITY CHECK
    qualityCheckedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    qualityCheckedAt: Date,

    // 🔥 METADATA
    metadataAddedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    metadataAddedAt: Date,

    // 🔥 REJECTION TRACKING
    rejectionReason: String,

    rejectedToStage: String,

    rejectedToUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    rejectedAt: Date,

    // 🔥 FINAL APPROVAL
    finalApprovedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    finalApprovedAt: Date,

    // 🔥 DEPARTMENT APPROVAL (LAST STAGE)
    departmentApprovedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    departmentApprovedAt: Date,

    // 🔥 STATUS FLOW
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
        "DEPARTMENT_APPROVED",
      ],
      default: "RFID_TAGGED",
    },
  },
  { timestamps: true },
);

// 🔥 INDEXES (IMPORTANT FOR PERFORMANCE)
documentSchema.index({ status: 1 });
documentSchema.index({ department: 1 });

export default mongoose.model("Document", documentSchema);
