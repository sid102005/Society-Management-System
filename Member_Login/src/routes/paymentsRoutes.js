const express = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validate");
const {
  initiatePayment,
  createPayment,
  listPaymentHistory,
  getAutoPaySettings,
  updateAutoPaySettings,
} = require("../controllers/paymentController");

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/initiate",
  [
    body("billId").isMongoId().withMessage("Valid billId is required"),
    body("amountPaid")
      .optional()
      .isFloat({ min: 0.01 })
      .withMessage("Amount paid must be greater than zero"),
  ],
  validateRequest,
  initiatePayment,
);

router.post(
  "/",
  [
    body("billId").isMongoId().withMessage("Valid billId is required"),
    body("paymentMode")
      .isIn(["UPI", "Card", "Net Banking", "Wallet", "Cash"])
      .withMessage("Valid payment mode is required"),
    body("amountPaid")
      .optional()
      .isFloat({ min: 0.01 })
      .withMessage("Amount paid must be greater than zero"),
    body("paymentSignature")
      .trim()
      .notEmpty()
      .withMessage("Payment signature is required for cryptographic proof verification"),
    body("autoPayApplied")
      .optional()
      .isBoolean()
      .withMessage("autoPayApplied must be boolean"),
  ],
  validateRequest,
  createPayment,
);
router.get("/history", listPaymentHistory);
router.get("/autopay", getAutoPaySettings);
router.put(
  "/autopay",
  [
    body("autoPayEnabled")
      .optional()
      .isBoolean()
      .withMessage("autoPayEnabled must be boolean"),
    body("autoPayDay")
      .optional()
      .isInt({ min: 1, max: 28 })
      .withMessage("autoPayDay must be between 1 and 28"),
    body("autoPayMode")
      .optional()
      .isIn(["UPI", "Card", "Net Banking", "Wallet", "Cash"])
      .withMessage("Valid auto pay mode is required"),
  ],
  validateRequest,
  updateAutoPaySettings,
);

module.exports = router;
