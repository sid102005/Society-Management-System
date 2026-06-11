const express = require("express");
const { body } = require("express-validator");
const validateRequest = require("../middleware/validate");
const {
  registerResident,
  loginResident,
  logoutResident,
  currentResident,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/register",
  [
    body("fullName").trim().notEmpty().withMessage("Full name is required"),
    body("email")
      .isEmail()
      .withMessage("Valid email is required")
      .normalizeEmail(),
    body("phone").trim().notEmpty().withMessage("Phone is required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
    body("flatNumber").trim().notEmpty().withMessage("Flat number is required"),
    body("wing").trim().notEmpty().withMessage("Wing is required"),
    body("residentType")
      .isIn(["Owner", "Tenant"])
      .withMessage("Resident type must be Owner or Tenant"),
  ],
  validateRequest,
  registerResident,
);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Valid email is required")
      .normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  loginResident,
);

router.post("/logout", authMiddleware, logoutResident);
router.get("/me", authMiddleware, currentResident);

module.exports = router;
