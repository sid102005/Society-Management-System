const express = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validate");
const { createUploader } = require("../middleware/upload");
const {
  createSharedDocument,
  listSharedDocuments,
  deleteSharedDocument,
  resolveSharedDocument,
} = require("../controllers/documentSharingController");

const router = express.Router();
const upload = createUploader("shared-documents");

// Public route for resolving shared documents (no auth required)
router.get("/share/resolve/:token", resolveSharedDocument);

// Authenticated routes for managing shared documents
router.use(authMiddleware);

router.post(
  "/share",
  upload.single("documentFile"),
  [
    body("documentName")
      .trim()
      .notEmpty()
      .withMessage("Document name is required"),
    body("expiryDate").isISO8601().withMessage("Valid expiry date is required"),
    body("sharedWith").optional().trim(),
    body("filePath").optional().trim(),
  ],
  validateRequest,
  createSharedDocument,
);
router.get("/shared", listSharedDocuments);
router.delete("/share/:id", deleteSharedDocument);

module.exports = router;
