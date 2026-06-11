const mongoose = require("mongoose");

const kycSchema = new mongoose.Schema(
  {
    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resident",
      required: true,
      index: true,
    },
    documentType: {
      type: String,
      required: true,
      trim: true,
    },
    documentNumber: {
      type: String,
      required: true,
      trim: true,
    },
    documentFile: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Kyc", kycSchema);
