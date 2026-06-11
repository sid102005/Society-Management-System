const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  listNotifications,
  markNotificationRead,
} = require("../controllers/notificationController");

const router = express.Router();

router.use(authMiddleware);

router.get("/", listNotifications);
router.put("/:id/read", markNotificationRead);

module.exports = router;
