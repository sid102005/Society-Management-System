const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  listDocuments,
  getDocumentById,
} = require("../controllers/documentController");

const router = express.Router();

router.use(authMiddleware);

router.get("/", listDocuments);
router.get("/:id", getDocumentById);

module.exports = router;
