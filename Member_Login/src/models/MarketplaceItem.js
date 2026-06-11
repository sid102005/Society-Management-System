const mongoose = require("mongoose");

const marketplaceItemSchema = new mongoose.Schema(
  {
    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resident",
      required: true,
      index: true,
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
    category: {
      type: String,
      enum: ["Electronics", "Furniture", "Books", "Clothing", "Vehicles", "Services", "Other"],
      required: true,
    },
    itemType: {
      type: String,
      enum: ["For Sale", "For Rent", "Free", "Wanted"],
      required: true,
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
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
    location: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["Active", "Sold", "Rented", "Closed"],
      default: "Active",
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("MarketplaceItem", marketplaceItemSchema);
