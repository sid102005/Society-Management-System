const mongoose = require("mongoose");

const parcelSchema = new mongoose.Schema(
  {
    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resident",
      required: true,
      index: true,
    },
    deliveryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Delivery",
      default: null,
      index: true,
    },
    parcelType: {
      type: String,
      required: true,
      trim: true,
    },
    trackingNumber: {
      type: String,
      required: true,
      trim: true,
    },
    courier: {
      type: String,
      default: "",
      trim: true,
    },
    expectedDeliveryAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["Expected", "Delivered", "Returned"],
      default: "Expected",
    },
    notificationSent: {
      type: Boolean,
      default: false,
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

parcelSchema.index({ residentId: 1, trackingNumber: 1 }, { unique: true });

module.exports = mongoose.model("Parcel", parcelSchema);
