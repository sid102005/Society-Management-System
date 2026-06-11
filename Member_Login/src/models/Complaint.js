const mongoose = require("mongoose");

const complaintCommentSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
    },
    commentedBy: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

const complaintSchema = new mongoose.Schema(
  {
    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resident",
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
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
    image: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved"],
      default: "Open",
    },
    comments: [complaintCommentSchema],
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    complaintType: {
      type: String,
      enum: ["Complaint", "ServiceRequest"],
      default: "Complaint",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Complaint", complaintSchema);
