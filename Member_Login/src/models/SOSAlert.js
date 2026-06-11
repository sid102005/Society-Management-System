const mongoose = require("mongoose");

const sosAlertSchema = new mongoose.Schema(
  {
    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resident",
      required: true,
      index: true,
    },
    alertType: {
      type: String,
      enum: ["Medical", "Fire", "Security", "Other"],
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["Active", "Acknowledged", "Resolved", "False Alarm"],
      default: "Active",
    },
    acknowledgedBy: {
      type: String,
      default: "",
    },
    acknowledgedAt: {
      type: Date,
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("SOSAlert", sosAlertSchema);
