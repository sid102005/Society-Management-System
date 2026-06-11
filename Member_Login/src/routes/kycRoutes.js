const express = require("express");
const { body } = require("express-validator");
const validateRequest = require("../middleware/validate");
const authMiddleware = require("../middleware/authMiddleware");
const { createUploader } = require("../middleware/upload");
const { uploadKyc, listKyc } = require("../controllers/kycController");

const router = express.Router();
const upload = createUploader("kyc");

router.use(authMiddleware);

router.post(
  "/upload",
  upload.single("documentFile"),
  [
    body("documentType")
      .trim()
      .notEmpty()
      .withMessage("Document type is required"),
    body("documentNumber")
      .trim()
      .notEmpty()
      .withMessage("Document number is required"),
  ],
  validateRequest,
  uploadKyc,
);
router.get("/", listKyc);

module.exports = router;
