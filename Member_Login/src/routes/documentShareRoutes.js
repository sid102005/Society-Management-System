const express = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validate");
const {
  createDocumentShare,
  listDocumentShares,
  deleteDocumentShare,
  resolveDocumentShare,
} = require("../controllers/documentShareController");

const router = express.Router();

router.get("/resolve/:token", resolveDocumentShare);

router.use(authMiddleware);

router.post(
  "/",
  [
    body("documentId").isMongoId().withMessage("Valid Document ID is required"),
    body("sharedWithEmail").isEmail().withMessage("Valid shared email is required"),
    body("expiryDate").isISO8601().withMessage("Valid expiry date is required"),
  ],
  validateRequest,
  createDocumentShare,
);

router.get("/", listDocumentShares);
router.delete("/:id", deleteDocumentShare);

module.exports = router;
