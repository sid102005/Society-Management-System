const express = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validate");
const {
  createParcel,
  listParcels,
} = require("../controllers/parcelController");

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/",
  [
    body("parcelType").trim().notEmpty().withMessage("Parcel type is required"),
    body("trackingNumber")
      .trim()
      .notEmpty()
      .withMessage("Tracking number is required"),
    body("courier").optional().trim(),
    body("expectedDeliveryAt")
      .optional()
      .isISO8601()
      .withMessage("Valid delivery date is required"),
    body("deliveryId")
      .optional()
      .isMongoId()
      .withMessage("Valid deliveryId is required"),
    body("notes").optional().trim(),
  ],
  validateRequest,
  createParcel,
);
router.get("/", listParcels);

module.exports = router;
