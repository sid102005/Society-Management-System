const Accommodation = require("../models/Accommodation");
const AccommodationBooking = require("../models/AccommodationBooking");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/appError");
const { successResponse } = require("../utils/response");

const listAccommodations = asyncHandler(async (req, res) => {
  const accommodations = await Accommodation.find({ isActive: true }).sort({ name: 1 });
  return successResponse(res, "Accommodations fetched successfully", { accommodations });
});

const getAccommodationById = asyncHandler(async (req, res) => {
  const accommodation = await Accommodation.findOne({ _id: req.params.id, isActive: true });
  if (!accommodation) {
    throw new AppError(404, "Accommodation not found");
  }
  return successResponse(res, "Accommodation fetched successfully", { accommodation });
});

const createBooking = asyncHandler(async (req, res) => {
  const { accommodationId, guestName, guestCount, checkInDate, checkOutDate, notes } = req.body;

  const accommodation = await Accommodation.findOne({ _id: accommodationId, isActive: true });
  if (!accommodation) {
    throw new AppError(404, "Accommodation not found");
  }

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (checkIn < today) {
    throw new AppError(400, "Check-in date cannot be in the past");
  }
  if (checkOut <= checkIn) {
    throw new AppError(400, "Check-out date must be after check-in date");
  }

  if (guestCount > accommodation.capacity) {
    throw new AppError(400, `Guest count exceeds the accommodation capacity of ${accommodation.capacity}`);
  }

  // Check for date overlap (overlap query)
  const overlappingBooking = await AccommodationBooking.findOne({
    accommodationId: accommodation._id,
    status: "Confirmed",
    checkInDate: { $lt: checkOut },
    checkOutDate: { $gt: checkIn },
  });

  if (overlappingBooking) {
    throw new AppError(409, "This accommodation is already booked for the selected dates");
  }

  // Calculate total amount based on number of days (min 1 day)
  const diffTime = Math.abs(checkOut - checkIn);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  const totalAmount = diffDays * accommodation.chargesPerDay;

  const booking = await AccommodationBooking.create({
    residentId: req.currentResident._id,
    accommodationId: accommodation._id,
    guestName,
    guestCount,
    checkInDate: checkIn,
    checkOutDate: checkOut,
    totalAmount,
    notes: notes || "",
  });

  return successResponse(res, "Accommodation booking created successfully", { booking }, 201);
});

const listMyBookings = asyncHandler(async (req, res) => {
  const bookings = await AccommodationBooking.find({ residentId: req.currentResident._id })
    .populate("accommodationId")
    .sort({ checkInDate: -1, createdAt: -1 });
  return successResponse(res, "Accommodation bookings fetched successfully", { bookings });
});

const getBookingById = asyncHandler(async (req, res) => {
  const booking = await AccommodationBooking.findOne({
    _id: req.params.id,
    residentId: req.currentResident._id,
  }).populate("accommodationId");

  if (!booking) {
    throw new AppError(404, "Accommodation booking not found");
  }
  return successResponse(res, "Accommodation booking fetched successfully", { booking });
});

const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await AccommodationBooking.findOne({
    _id: req.params.id,
    residentId: req.currentResident._id,
  });

  if (!booking) {
    throw new AppError(404, "Accommodation booking not found");
  }

  if (booking.status !== "Confirmed") {
    throw new AppError(400, "Can only cancel confirmed bookings");
  }

  const checkIn = new Date(booking.checkInDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 24 hour cancellation rule
  const hoursDiff = (checkIn - today) / (1000 * 60 * 60);
  if (hoursDiff < 24) {
    throw new AppError(400, "Bookings can only be cancelled at least 24 hours in advance");
  }

  booking.status = "Cancelled";
  await booking.save();

  return successResponse(res, "Accommodation booking cancelled successfully", { booking });
});

module.exports = {
  listAccommodations,
  getAccommodationById,
  createBooking,
  listMyBookings,
  getBookingById,
  cancelBooking,
};
