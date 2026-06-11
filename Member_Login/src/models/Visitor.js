const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resident",
      required: true,
      index: true,
    },
    visitorName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    purpose: {
      type: String,
      required: true,
      trim: true,
    },
    expectedVisitAt: {
      type: Date,
      default: null,
    },
    entryTime: {
      type: Date,
      default: null,
    },
    exitTime: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Denied", "Inside", "Exited"],
      default: "Pending",
    },
    approvalMethod: {
      type: String,
      default: "OTP",
    },
    deniedReason: {
      type: String,
      default: "",
      trim: true,
    },
    otpVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Visitor", visitorSchema);
