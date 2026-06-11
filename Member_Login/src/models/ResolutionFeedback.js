const mongoose = require("mongoose");

const resolutionFeedbackSchema = new mongoose.Schema(
  {
    resolutionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommitteeDecision",
      required: true,
      index: true,
    },
    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resident",
      required: true,
      index: true,
    },
    feedbackText: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    reaction: {
      type: String,
      enum: ["support", "neutral", "oppose"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

resolutionFeedbackSchema.index({ resolutionId: 1, residentId: 1 }, { unique: true });

module.exports = mongoose.model("ResolutionFeedback", resolutionFeedbackSchema);
