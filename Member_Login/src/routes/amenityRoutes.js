const express = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validate");
const {
  listAmenities,
  getAmenityById,
  createBooking,
  listMyBookings,
  getBookingById,
  cancelBooking,
  rateAmenity,
} = require("../controllers/amenityController");

const router = express.Router();

router.use(authMiddleware);

// Amenity endpoints
router.get("/amenities", listAmenities);
router.get("/amenities/:id", getAmenityById);

// Booking endpoints
router.post(
  "/bookings",
  [
    body("amenityId").notEmpty().withMessage("Amenity ID is required"),
    body("bookingDate").isISO8601().withMessage("Valid booking date is required"),
    body("startTime").trim().notEmpty().withMessage("Start time is required"),
    body("endTime").trim().notEmpty().withMessage("End time is required"),
    body("duration")
      .isInt({ min: 1 })
      .withMessage("Duration must be at least 1 hour"),
    body("notes").optional().trim(),
  ],
  validateRequest,
  createBooking,
);
router.get("/bookings", listMyBookings);
router.get("/bookings/:id", getBookingById);
router.post("/bookings/:id/cancel", cancelBooking);
router.post(
  "/bookings/:id/rate",
  [
    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
  ],
  validateRequest,
  rateAmenity,
);

module.exports = router;
