const express = require("express");
const { body } = require("express-validator");
const validateRequest = require("../middleware/validate");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createFamilyMember,
  listFamilyMembers,
  updateFamilyMember,
  deleteFamilyMember,
} = require("../controllers/familyController");

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("relation").trim().notEmpty().withMessage("Relation is required"),
    body("age").isInt({ min: 0 }).withMessage("Age must be a valid number"),
  ],
  validateRequest,
  createFamilyMember,
);
router.get("/", listFamilyMembers);
router.put(
  "/:id",
  [
    body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
    body("relation").optional().trim().notEmpty().withMessage("Relation cannot be empty"),
    body("age").optional().isInt({ min: 0 }).withMessage("Age must be a valid non-negative integer"),
  ],
  validateRequest,
  updateFamilyMember,
);
router.delete("/:id", deleteFamilyMember);

module.exports = router;
