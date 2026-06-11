const mongoose = require("mongoose");

const nocRequestSchema = new mongoose.Schema(
  {
    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resident",
      required: true,
      index: true,
    },
    requestType: {
      type: String,
      enum: [
        "Maintenance Clearance",
        "Rental NOC",
        "Loan NOC",
        "Transfer NOC",
        "Other",
      ],
      default: "Other",
      trim: true,
    },
    purpose: {
      type: String,
      required: true,
      trim: true,
    },
    requestedFor: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    adminRemarks: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("NocRequest", nocRequestSchema);
