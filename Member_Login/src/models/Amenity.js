const mongoose = require("mongoose");

const amenitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["Club House", "Swimming Pool", "Gym", "Tennis Court", "Community Hall", "Guest Room", "Other"],
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    chargesPerHour: {
      type: Number,
      required: true,
      min: 0,
    },
    operatingHours: {
      start: {
        type: String,
        required: true,
      },
      end: {
        type: String,
        required: true,
      },
    },
    facilities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Amenity", amenitySchema);
