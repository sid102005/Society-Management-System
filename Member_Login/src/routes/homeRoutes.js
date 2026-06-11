const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getHomeDashboard } = require("../controllers/homeController");

const router = express.Router();

router.get("/dashboard", authMiddleware, getHomeDashboard);

module.exports = router;
