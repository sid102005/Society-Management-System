const mongoose = require("mongoose");

const propertyListingSchema = new mongoose.Schema(
  {
    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resident",
      required: true,
      index: true,
    },
    listingType: {
      type: String,
      enum: ["Sale", "Rent", "Rental", "Resale"],
      required: true,
      trim: true,
    },
    propertyType: {
      type: String,
      default: "Apartment",
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
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    contactNumber: {
      type: String,
      default: "",
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field for backwards compatibility with "type" (Rental/Resale)
propertyListingSchema.virtual("type").get(function () {
  if (this.listingType === "Sale" || this.listingType === "Resale") {
    return "Resale";
  }
  return "Rental";
}).set(function (value) {
  if (value === "Resale" || value === "Sale") {
    this.listingType = "Sale";
  } else {
    this.listingType = "Rent";
  }
});

// Virtual field for backwards compatibility with "expectedPrice"
propertyListingSchema.virtual("expectedPrice").get(function () {
  return this.price;
}).set(function (value) {
  this.price = value;
});

module.exports = mongoose.model("PropertyListing", propertyListingSchema);
