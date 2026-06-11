const express = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validate");
const {
  listAccommodations,
  getAccommodationById,
  createBooking,
  listMyBookings,
  getBookingById,
  cancelBooking,
} = require("../controllers/accommodationController");

const router = express.Router();

router.use(authMiddleware);

router.get("/", listAccommodations);
router.get("/bookings", listMyBookings);
router.get("/bookings/:id", getBookingById);
router.get("/:id", getAccommodationById);

router.post(
  "/bookings",
  [
    body("accommodationId").isMongoId().withMessage("Valid accommodation ID is required"),
    body("guestName").trim().notEmpty().withMessage("Guest name is required"),
    body("guestCount").isInt({ min: 1 }).withMessage("Guest count must be at least 1"),
    body("checkInDate").isISO8601().withMessage("Valid check-in date is required"),
    body("checkOutDate").isISO8601().withMessage("Valid check-out date is required"),
    body("notes").optional().trim(),
  ],
  validateRequest,
  createBooking,
);

router.post("/bookings/:id/cancel", cancelBooking);

module.exports = router;
