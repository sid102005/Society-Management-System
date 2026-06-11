const express = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validate");
const {
  createHelper,
  listHelpers,
  createAttendance,
  listAttendance,
} = require("../controllers/helperController");

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/",
  [
    body("helperName").trim().notEmpty().withMessage("Helper name is required"),
    body("role").trim().notEmpty().withMessage("Role is required"),
    body("phone").optional().trim(),
    body("shiftStart").optional().trim(),
    body("shiftEnd").optional().trim(),
    body("notes").optional().trim(),
  ],
  validateRequest,
  createHelper,
);
router.get("/", listHelpers);
router.post(
  "/attendance",
  [
    body("helperId").isMongoId().withMessage("Valid helperId is required"),
    body("attendanceDate")
      .isISO8601()
      .withMessage("Valid attendance date is required"),
    body("status")
      .optional()
      .isIn(["Present", "Absent", "On Leave"])
      .withMessage("Valid attendance status is required"),
    body("checkInTime")
      .optional()
      .isISO8601()
      .withMessage("Valid check-in time is required"),
    body("checkOutTime")
      .optional()
      .isISO8601()
      .withMessage("Valid check-out time is required"),
    body("notes").optional().trim(),
  ],
  validateRequest,
  createAttendance,
);
router.get("/attendance", listAttendance);

module.exports = router;
