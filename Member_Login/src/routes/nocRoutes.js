const express = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validate");
const {
  createNocRequest,
  listNocRequests,
} = require("../controllers/nocController");

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/request",
  [
    body("purpose").trim().notEmpty().withMessage("Purpose is required"),
    body("requestedFor").optional().trim(),
    body("requestType")
      .optional()
      .isIn([
        "Maintenance Clearance",
        "Rental NOC",
        "Loan NOC",
        "Transfer NOC",
        "Other",
      ])
      .withMessage("Valid request type is required"),
  ],
  validateRequest,
  createNocRequest,
);
router.get("/", listNocRequests);

module.exports = router;
