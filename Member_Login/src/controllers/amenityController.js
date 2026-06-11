const Amenity = require("../models/Amenity");
const AmenityBooking = require("../models/AmenityBooking");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/appError");
const { successResponse } = require("../utils/response");

const listAmenities = asyncHandler(async (req, res) => {
  const amenities = await Amenity.find({ isActive: true }).sort({ name: 1 });
  return successResponse(res, "Amenities fetched successfully", { amenities });
});

const getAmenityById = asyncHandler(async (req, res) => {
  const amenity = await Amenity.findOne({ _id: req.params.id, isActive: true });
  
  if (!amenity) {
    throw new AppError(404, "Amenity not found");
  }

  return successResponse(res, "Amenity fetched successfully", { amenity });
});

const createBooking = asyncHandler(async (req, res) => {
  const amenity = await Amenity.findOne({ _id: req.body.amenityId, isActive: true });
  
  if (!amenity) {
    throw new AppError(404, "Amenity not found");
  }

  const bookingDate = new Date(req.body.bookingDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (bookingDate < today) {
    throw new AppError(400, "Booking date cannot be in the past");
  }

  // Check for existing booking at the same time
  const existingBooking = await AmenityBooking.findOne({
    amenityId: req.body.amenityId,
    bookingDate: bookingDate,
    startTime: req.body.startTime,
    status: "Confirmed",
  });

  if (existingBooking) {
    throw new AppError(409, "This slot is already booked");
  }

  const duration = parseInt(req.body.duration, 10);
  const totalCharges = duration * amenity.chargesPerHour;

  const booking = await AmenityBooking.create({
    residentId: req.currentResident._id,
    amenityId: req.body.amenityId,
    bookingDate: bookingDate,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    duration,
    totalCharges,
    notes: req.body.notes || "",
  });

  return successResponse(res, "Booking created successfully", { booking }, 201);
});

const listMyBookings = asyncHandler(async (req, res) => {
  const bookings = await AmenityBooking.find({ residentId: req.currentResident._id })
    .populate("amenityId")
    .sort({ bookingDate: -1, createdAt: -1 });

  return successResponse(res, "Bookings fetched successfully", { bookings });
});

const getBookingById = asyncHandler(async (req, res) => {
  const booking = await AmenityBooking.findOne({
    _id: req.params.id,
    residentId: req.currentResident._id,
  }).populate("amenityId");

  if (!booking) {
    throw new AppError(404, "Booking not found");
  }

  return successResponse(res, "Booking fetched successfully", { booking });
});

const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await AmenityBooking.findOne({
    _id: req.params.id,
    residentId: req.currentResident._id,
  });

  if (!booking) {
    throw new AppError(404, "Booking not found");
  }

  if (booking.status !== "Confirmed") {
    throw new AppError(400, "Can only cancel confirmed bookings");
  }

  const bookingDate = new Date(booking.bookingDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Allow cancellation only if booking date is at least 24 hours away
  const hoursDiff = (bookingDate - today) / (1000 * 60 * 60);
  if (hoursDiff < 24) {
    throw new AppError(400, "Bookings can only be cancelled at least 24 hours in advance");
  }

  booking.status = "Cancelled";
  await booking.save();

  return successResponse(res, "Booking cancelled successfully", { booking });
});

const rateAmenity = asyncHandler(async (req, res) => {
  const booking = await AmenityBooking.findOne({
    _id: req.params.id,
    residentId: req.currentResident._id,
  });

  if (!booking) {
    throw new AppError(404, "Booking not found");
  }

  if (booking.status !== "Completed") {
    throw new AppError(400, "Can only rate completed bookings");
  }

  if (booking.rating !== null) {
    throw new AppError(400, "Booking has already been rated");
  }

  const rating = parseInt(req.body.rating, 10);
  if (isNaN(rating) || rating < 1 || rating > 5) {
    throw new AppError(400, "Rating must be between 1 and 5");
  }

  booking.rating = rating;
  await booking.save();

  return successResponse(res, "Amenity rated successfully", { booking });
});

module.exports = {
  listAmenities,
  getAmenityById,
  createBooking,
  listMyBookings,
  getBookingById,
  cancelBooking,
  rateAmenity,
};
