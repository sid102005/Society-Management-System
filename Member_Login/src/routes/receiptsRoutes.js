const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getReceiptById } = require("../controllers/receiptController");

const router = express.Router();

router.use(authMiddleware);

router.get("/:id", getReceiptById);

module.exports = router;
