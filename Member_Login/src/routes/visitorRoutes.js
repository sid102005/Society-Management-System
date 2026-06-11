const express = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validate");
const {
  preApproveVisitor,
  approveVisitor,
  denyVisitor,
  checkoutVisitor,
  listVisitorHistory,
} = require("../controllers/visitorController");

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/preapprove",
  [
    body("visitorName")
      .trim()
      .notEmpty()
      .withMessage("Visitor name is required"),
    body("purpose").trim().notEmpty().withMessage("Purpose is required"),
    body("phone").optional().trim(),
    body("expectedVisitAt")
      .optional()
      .isISO8601()
      .withMessage("Valid expected visit time is required"),
  ],
  validateRequest,
  preApproveVisitor,
);
router.post(
  "/approve",
  [
    body("visitorId").isMongoId().withMessage("Valid visitorId is required"),
    body("otp")
      .isLength({ min: 6, max: 6 })
      .withMessage("Valid 6-digit OTP is required"),
  ],
  validateRequest,
  approveVisitor,
);
router.post(
  "/deny",
  [
    body("visitorId").isMongoId().withMessage("Valid visitorId is required"),
    body("reason").optional().trim(),
  ],
  validateRequest,
  denyVisitor,
);
router.post(
  "/exit",
  [body("visitorId").isMongoId().withMessage("Valid visitorId is required")],
  validateRequest,
  checkoutVisitor,
);
router.get("/history", listVisitorHistory);

module.exports = router;
