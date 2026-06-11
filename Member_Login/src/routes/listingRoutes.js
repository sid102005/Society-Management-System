const express = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validate");
const { createUploader } = require("../middleware/upload");
const {
  createListing,
  listListings,
  getListingById,
  updateListing,
  deleteListing,
} = require("../controllers/listingController");

const router = express.Router();
const upload = createUploader("listings");

router.use(authMiddleware);

router.post(
  "/",
  upload.array("images", 5),
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description").trim().notEmpty().withMessage("Description is required"),
    body("listingType")
      .custom((val, { req }) => {
        if (!val && !req.body.type) {
          throw new Error("Either listingType or type is required");
        }
        const checkVal = val || req.body.type;
        if (!["Sale", "Rent", "Rental", "Resale"].includes(checkVal)) {
          throw new Error("Invalid type or listingType");
        }
        return true;
      }),
    body("price")
      .custom((val, { req }) => {
        if (val === undefined && req.body.expectedPrice === undefined) {
          throw new Error("Either price or expectedPrice is required");
        }
        const numericVal = val !== undefined ? val : req.body.expectedPrice;
        if (isNaN(numericVal) || parseFloat(numericVal) < 0) {
          throw new Error("Price must be a positive number");
        }
        return true;
      }),
  ],
  validateRequest,
  createListing,
);
router.get("/", listListings);
router.get("/:id", getListingById);
router.put(
  "/:id",
  upload.array("images", 5),
  [
    body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
    body("description").optional().trim().notEmpty().withMessage("Description cannot be empty"),
    body("listingType")
      .optional()
      .isIn(["Sale", "Rent", "Rental", "Resale"])
      .withMessage("Invalid listingType"),
    body("type")
      .optional()
      .isIn(["Sale", "Rent", "Rental", "Resale"])
      .withMessage("Invalid type"),
    body("price")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number"),
    body("expectedPrice")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Expected price must be a positive number"),
  ],
  validateRequest,
  updateListing,
);
router.delete("/:id", deleteListing);

module.exports = router;
