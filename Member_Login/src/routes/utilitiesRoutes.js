const express = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validate");
const {
  listUtilities,
  createUtilityMeter,
} = require("../controllers/utilityController");

const router = express.Router();

router.use(authMiddleware);

router.get("/", listUtilities);
router.post(
  "/",
  [
    body("utilityType")
      .isIn(["Electricity", "Water", "Gas"])
      .withMessage("Utility type must be Electricity, Water, or Gas"),
    body("readingMonth")
      .trim()
      .notEmpty()
      .withMessage("Reading month is required"),
    body("previousReading")
      .isFloat({ min: 0 })
      .withMessage("Previous reading must be a non-negative number"),
    body("currentReading")
      .isFloat({ min: 0 })
      .withMessage("Current reading must be a non-negative number"),
    body("ratePerUnit")
      .isFloat({ min: 0 })
      .withMessage("Rate per unit must be a non-negative number"),
    body("notes").optional().trim(),
  ],
  validateRequest,
  createUtilityMeter,
);

module.exports = router;
