const express = require("express");
const { body } = require("express-validator");
const validateRequest = require("../middleware/validate");
const authMiddleware = require("../middleware/authMiddleware");
const { createUploader } = require("../middleware/upload");
const {
  createComplaint,
  listComplaints,
  getComplaintById,
  updateComplaint,
  addComplaintComment,
  streamComplaints,
  rateComplaintResolution,
  createServiceRequest,
} = require("../controllers/complaintController");

const router = express.Router();
const upload = createUploader("complaints");

router.use(authMiddleware);

router.post(
  "/",
  upload.single("image"),
  [
    body("category").trim().notEmpty().withMessage("Category is required"),
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required"),
  ],
  validateRequest,
  createComplaint,
);
router.get("/", listComplaints);
router.get("/stream", streamComplaints);
router.get("/:id", getComplaintById);
router.put("/:id", upload.single("image"), updateComplaint);
router.post(
  "/:id/comment",
  [
    body("message")
      .trim()
      .notEmpty()
      .withMessage("Comment message is required"),
  ],
  validateRequest,
  addComplaintComment,
);
router.post(
  "/:id/rate",
  [
    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
  ],
  validateRequest,
  rateComplaintResolution,
);
router.post(
  "/service/request",
  upload.single("image"),
  [
    body("category").trim().notEmpty().withMessage("Category is required"),
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required"),
  ],
  validateRequest,
  createServiceRequest,
);

module.exports = router;
