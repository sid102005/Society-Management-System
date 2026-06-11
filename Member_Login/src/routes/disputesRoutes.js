const express = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validate");
const {
  createDispute,
  listDisputes,
} = require("../controllers/disputeController");

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/",
  [
    body("subject").trim().notEmpty().withMessage("Subject is required"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required"),
    body("billId")
      .optional()
      .isMongoId()
      .withMessage("Valid billId is required"),
  ],
  validateRequest,
  createDispute,
);
router.get("/", listDisputes);

module.exports = router;
