const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema(
  {
    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resident",
      required: true,
      index: true,
    },
    deliveryPartner: {
      type: String,
      required: true,
      trim: true,
    },
    recipientName: {
      type: String,
      required: true,
      trim: true,
    },
    purpose: {
      type: String,
      default: "",
      trim: true,
    },
    authorizationCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Authorized", "Denied"],
      default: "Pending",
    },
    authorizedAt: {
      type: Date,
      default: null,
    },
    deniedAt: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Delivery", deliverySchema);
