const mongoose = require("mongoose");

const amenityBookingSchema = new mongoose.Schema(
  {
    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resident",
      required: true,
      index: true,
    },
    amenityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Amenity",
      required: true,
      index: true,
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    totalCharges: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Confirmed", "Cancelled", "Completed", "No-Show"],
      default: "Confirmed",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Refunded"],
      default: "Pending",
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
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

amenityBookingSchema.index({ amenityId: 1, bookingDate: 1, startTime: 1 }, { unique: true });

module.exports = mongoose.model("AmenityBooking", amenityBookingSchema);
