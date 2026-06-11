const mongoose = require("mongoose");

const lostFoundItemSchema = new mongoose.Schema(
  {
    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resident",
      required: true,
      index: true,
    },
    itemType: {
      type: String,
      enum: ["Lost", "Found"],
      required: true,
    },
    itemName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["Electronics", "Keys", "Documents", "Clothing", "Pets", "Other"],
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    dateLostFound: {
      type: Date,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    contactNumber: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Open", "Claimed", "Closed"],
      default: "Open",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("LostFoundItem", lostFoundItemSchema);
