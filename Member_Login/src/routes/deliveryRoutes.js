const express = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validate");
const { authorizeDelivery } = require("../controllers/deliveryController");

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/authorize",
  [
    body("deliveryPartner")
      .trim()
      .notEmpty()
      .withMessage("Delivery partner is required"),
    body("recipientName")
      .trim()
      .notEmpty()
      .withMessage("Recipient name is required"),
    body("purpose").optional().trim(),
    body("notes").optional().trim(),
  ],
  validateRequest,
  authorizeDelivery,
);

module.exports = router;
