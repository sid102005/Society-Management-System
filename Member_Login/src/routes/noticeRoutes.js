const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  listNotices,
  getNoticeById,
} = require("../controllers/noticeController");

const router = express.Router();

router.use(authMiddleware);

router.get("/", listNotices);
router.get("/:id", getNoticeById);

module.exports = router;
