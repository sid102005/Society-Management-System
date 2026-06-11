const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  listBills,
  listOutstandingBills,
  listBillHistory,
} = require("../controllers/billController");

const router = express.Router();

router.use(authMiddleware);

router.get("/", listBills);
router.get("/outstanding", listOutstandingBills);
router.get("/history", listBillHistory);

module.exports = router;
