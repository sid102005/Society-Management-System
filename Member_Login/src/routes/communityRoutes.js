const express = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validate");
const { createUploader } = require("../middleware/upload");
const {
  listPolls,
  votePoll,
  listDiscussions,
  createDiscussion,
  addDiscussionComment,
  listEvents,
  registerForEvent,
  listMyEventRegistrations,
  listMarketplaceItems,
  createMarketplaceItem,
  listLostFoundItems,
  createLostFoundItem,
} = require("../controllers/communityController");

const router = express.Router();
const marketplaceUpload = createUploader("marketplace");
const lostFoundUpload = createUploader("lostfound");

router.use(authMiddleware);

// Polls
router.get("/polls", listPolls);
router.post(
  "/polls/:id/vote",
  [body("optionIndex").isInt({ min: 0 }).withMessage("Valid option index is required")],
  validateRequest,
  votePoll,
);

// Discussions
router.get("/discussions", listDiscussions);
router.post(
  "/discussions",
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("content").trim().notEmpty().withMessage("Content is required"),
    body("category").optional().isIn(["General", "Maintenance", "Events", "Security", "Suggestions", "Other"]),
  ],
  validateRequest,
  createDiscussion,
);
router.post(
  "/discussions/:id/comment",
  [body("message").trim().notEmpty().withMessage("Message is required")],
  validateRequest,
  addDiscussionComment,
);

// Events
router.get("/events", listEvents);
router.post("/events/:id/register", registerForEvent);
router.get("/events/my-registrations", listMyEventRegistrations);

// Marketplace
router.get("/marketplace", listMarketplaceItems);
router.post(
  "/marketplace",
  marketplaceUpload.array("images", 5),
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description").trim().notEmpty().withMessage("Description is required"),
    body("category").isIn(["Electronics", "Furniture", "Books", "Clothing", "Vehicles", "Services", "Other"]),
    body("itemType").isIn(["For Sale", "For Rent", "Free", "Wanted"]),
    body("contactNumber").trim().notEmpty().withMessage("Contact number is required"),
    body("price").optional().isFloat({ min: 0 }),
  ],
  validateRequest,
  createMarketplaceItem,
);

// Lost & Found
router.get("/lostfound", listLostFoundItems);
router.post(
  "/lostfound",
  lostFoundUpload.array("images", 5),
  [
    body("itemType").isIn(["Lost", "Found"]),
    body("itemName").trim().notEmpty().withMessage("Item name is required"),
    body("description").trim().notEmpty().withMessage("Description is required"),
    body("category").isIn(["Electronics", "Keys", "Documents", "Clothing", "Pets", "Other"]),
    body("location").trim().notEmpty().withMessage("Location is required"),
    body("dateLostFound").isISO8601().withMessage("Valid date is required"),
    body("contactNumber").trim().notEmpty().withMessage("Contact number is required"),
  ],
  validateRequest,
  createLostFoundItem,
);

module.exports = router;
