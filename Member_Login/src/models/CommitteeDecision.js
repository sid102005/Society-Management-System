const mongoose = require("mongoose");

const committeeDecisionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    decisionDate: {
      type: Date,
      default: Date.now,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    outcome: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Implemented", "In Progress", "Cancelled"],
      default: "In Progress",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CommitteeDecision", committeeDecisionSchema);
