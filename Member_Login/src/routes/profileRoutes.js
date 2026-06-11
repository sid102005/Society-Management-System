const express = require("express");
const { body } = require("express-validator");
const validateRequest = require("../middleware/validate");
const authMiddleware = require("../middleware/authMiddleware");
const { createUploader } = require("../middleware/upload");
const {
  viewProfile,
  dashboardProfile,
  updateProfile,
  uploadProfilePhoto,
} = require("../controllers/profileController");

const router = express.Router();
const upload = createUploader("profiles");

router.get("/", authMiddleware, viewProfile);
router.get("/dashboard", authMiddleware, dashboardProfile);
router.put(
  "/",
  authMiddleware,
  [
    body("fullName")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Full name cannot be empty"),
    body("phone")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Phone cannot be empty"),
    body("flatNumber")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Flat number cannot be empty"),
    body("wing")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Wing cannot be empty"),
    body("floor")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Floor cannot be empty"),
    body("societyName")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Society name cannot be empty"),
    body("residentType")
      .optional()
      .isIn(["Owner", "Tenant"])
      .withMessage("Resident type must be Owner or Tenant"),
  ],
  validateRequest,
  updateProfile,
);
router.post(
  "/upload-photo",
  authMiddleware,
  upload.single("profileImage"),
  uploadProfilePhoto,
);

module.exports = router;
