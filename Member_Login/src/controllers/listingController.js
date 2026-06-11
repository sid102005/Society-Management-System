const PropertyListing = require("../models/PropertyListing");
const Notification = require("../models/Notification");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/appError");
const { successResponse } = require("../utils/response");
const path = require("path");
const fs = require("fs");

function getListingImages(req) {
  if (!Array.isArray(req.files) || req.files.length === 0) {
    return [];
  }

  return req.files.map((file) => `/uploads/listings/${file.filename}`);
}

const createListing = asyncHandler(async (req, res) => {
  const listingType = req.body.listingType || (req.body.type === "Rental" ? "Rent" : "Sale");
  const price = req.body.price !== undefined ? req.body.price : req.body.expectedPrice;
  
  if (price === undefined || isNaN(price) || parseFloat(price) < 0) {
    throw new AppError(400, "Price must be a positive number");
  }

  const propertyType = req.body.propertyType || "Apartment";
  const contactNumber = req.body.contactNumber || "";

  const listing = await PropertyListing.create({
    residentId: req.currentResident._id,
    listingType,
    propertyType,
    title: req.body.title,
    description: req.body.description,
    price,
    contactNumber,
    images: getListingImages(req),
  });

  await Notification.create({
    residentId: req.currentResident._id,
    title: "Listing created",
    message: `Your listing "${listing.title}" was created successfully.`,
  });

  return successResponse(res, "Listing created successfully", { listing }, 201);
});

const listListings = asyncHandler(async (req, res) => {
  const listings = await PropertyListing.find({
    residentId: req.currentResident._id,
  }).sort({ createdAt: -1 });

  return successResponse(res, "Listings fetched successfully", { listings });
});

const getListingById = asyncHandler(async (req, res) => {
  const listing = await PropertyListing.findOne({
    _id: req.params.id,
    residentId: req.currentResident._id,
  });

  if (!listing) {
    throw new AppError(404, "Listing not found");
  }

  return successResponse(res, "Listing fetched successfully", { listing });
});

const updateListing = asyncHandler(async (req, res) => {
  const listing = await PropertyListing.findOne({
    _id: req.params.id,
    residentId: req.currentResident._id,
  });

  if (!listing) {
    throw new AppError(404, "Listing not found");
  }

  const price = req.body.price !== undefined ? req.body.price : req.body.expectedPrice;
  if (price !== undefined && (isNaN(price) || parseFloat(price) < 0)) {
    throw new AppError(400, "Price must be a positive number");
  }

  const updatableFields = [
    "listingType",
    "propertyType",
    "title",
    "description",
    "price",
    "contactNumber",
  ];

  updatableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      listing[field] = req.body[field];
    }
  });

  // Support legacy fields during update
  if (req.body.type !== undefined) {
    listing.type = req.body.type;
  }
  if (req.body.expectedPrice !== undefined) {
    listing.expectedPrice = req.body.expectedPrice;
  }

  const newImages = getListingImages(req);
  if (newImages.length > 0) {
    listing.images = [...listing.images, ...newImages];
  }

  await listing.save();

  return successResponse(res, "Listing updated successfully", { listing });
});

const deleteListing = asyncHandler(async (req, res) => {
  const listing = await PropertyListing.findOne({
    _id: req.params.id,
    residentId: req.currentResident._id,
  });

  if (!listing) {
    throw new AppError(404, "Listing not found");
  }

  // Delete all associated image files from disk
  if (listing.images && listing.images.length > 0) {
    listing.images.forEach((imagePath) => {
      if (imagePath.startsWith("/uploads/listings/")) {
        const fullPath = path.join(__dirname, "..", imagePath);
        try {
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        } catch (err) {
          console.error("Failed to delete listing image:", err.message);
        }
      }
    });
  }

  await PropertyListing.deleteOne({ _id: req.params.id });

  return successResponse(res, "Listing deleted successfully", { listing });
});

module.exports = {
  createListing,
  listListings,
  getListingById,
  updateListing,
  deleteListing,
};
