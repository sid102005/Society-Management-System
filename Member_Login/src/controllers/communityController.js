const Poll = require("../models/Poll");
const PollVote = require("../models/PollVote");
const Discussion = require("../models/Discussion");
const Event = require("../models/Event");
const EventRegistration = require("../models/EventRegistration");
const MarketplaceItem = require("../models/MarketplaceItem");
const LostFoundItem = require("../models/LostFoundItem");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/appError");
const { successResponse } = require("../utils/response");

// Polls
const listPolls = asyncHandler(async (req, res) => {
  const polls = await Poll.find({ status: "Active" })
    .where("endDate")
    .gte(new Date())
    .sort({ createdAt: -1 });
  return successResponse(res, "Polls fetched successfully", { polls });
});

const votePoll = asyncHandler(async (req, res) => {
  const poll = await Poll.findById(req.params.id);
  if (!poll) {
    throw new AppError(404, "Poll not found");
  }

  if (poll.status !== "Active") {
    throw new AppError(400, "Poll is not active");
  }

  if (new Date(poll.endDate) < new Date()) {
    throw new AppError(400, "Poll has ended");
  }

  const existingVote = await PollVote.findOne({
    pollId: poll._id,
    residentId: req.currentResident._id,
  });

  if (existingVote && !poll.allowMultipleVotes) {
    throw new AppError(400, "You have already voted on this poll");
  }

  const optionIndex = parseInt(req.body.optionIndex, 10);
  if (isNaN(optionIndex) || optionIndex < 0 || optionIndex >= poll.options.length) {
    throw new AppError(400, "Invalid option index");
  }

  await PollVote.create({
    pollId: poll._id,
    residentId: req.currentResident._id,
    optionIndex,
  });

  poll.options[optionIndex].votes += 1;
  await poll.save();

  return successResponse(res, "Vote recorded successfully", { poll });
});

// Discussions
const listDiscussions = asyncHandler(async (req, res) => {
  const discussions = await Discussion.find({ isActive: true })
    .sort({ isPinned: -1, createdAt: -1 });
  return successResponse(res, "Discussions fetched successfully", { discussions });
});

const createDiscussion = asyncHandler(async (req, res) => {
  const discussion = await Discussion.create({
    title: req.body.title,
    category: req.body.category || "General",
    content: req.body.content,
    createdBy: req.currentResident._id,
    creatorName: req.currentResident.fullName,
  });

  return successResponse(res, "Discussion created successfully", { discussion }, 201);
});

const addDiscussionComment = asyncHandler(async (req, res) => {
  const discussion = await Discussion.findById(req.params.id);
  if (!discussion) {
    throw new AppError(404, "Discussion not found");
  }

  discussion.comments.push({
    residentId: req.currentResident._id,
    message: req.body.message,
    residentName: req.currentResident.fullName,
  });

  await discussion.save();

  return successResponse(res, "Comment added successfully", { discussion });
});

// Events
const listEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ status: { $in: ["Upcoming", "Ongoing"] } })
    .sort({ eventDate: 1 });
  return successResponse(res, "Events fetched successfully", { events });
});

const registerForEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    throw new AppError(404, "Event not found");
  }

  if (event.status !== "Upcoming") {
    throw new AppError(400, "Event is not open for registration");
  }

  if (event.maxParticipants && event.currentParticipants >= event.maxParticipants) {
    throw new AppError(400, "Event is fully booked");
  }

  if (event.registrationDeadline && new Date(event.registrationDeadline) < new Date()) {
    throw new AppError(400, "Registration deadline has passed");
  }

  const existingRegistration = await EventRegistration.findOne({
    eventId: event._id,
    residentId: req.currentResident._id,
  });

  if (existingRegistration) {
    throw new AppError(400, "You are already registered for this event");
  }

  await EventRegistration.create({
    eventId: event._id,
    residentId: req.currentResident._id,
  });

  event.currentParticipants += 1;
  await event.save();

  return successResponse(res, "Event registration successful", { event });
});

const listMyEventRegistrations = asyncHandler(async (req, res) => {
  const registrations = await EventRegistration.find({ residentId: req.currentResident._id })
    .populate("eventId")
    .sort({ registrationDate: -1 });
  return successResponse(res, "Event registrations fetched successfully", { registrations });
});

// Marketplace
const listMarketplaceItems = asyncHandler(async (req, res) => {
  const items = await MarketplaceItem.find({ status: "Active" })
    .sort({ createdAt: -1 });
  return successResponse(res, "Marketplace items fetched successfully", { items });
});

const createMarketplaceItem = asyncHandler(async (req, res) => {
  const item = await MarketplaceItem.create({
    residentId: req.currentResident._id,
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    itemType: req.body.itemType,
    price: req.body.price || 0,
    images: req.files ? req.files.map(f => `/uploads/marketplace/${f.filename}`) : [],
    contactNumber: req.body.contactNumber,
    location: req.body.location || "",
  });

  return successResponse(res, "Marketplace item created successfully", { item }, 201);
});

// Lost & Found
const listLostFoundItems = asyncHandler(async (req, res) => {
  const items = await LostFoundItem.find({ status: "Open" })
    .sort({ createdAt: -1 });
  return successResponse(res, "Lost & found items fetched successfully", { items });
});

const createLostFoundItem = asyncHandler(async (req, res) => {
  const item = await LostFoundItem.create({
    residentId: req.currentResident._id,
    itemType: req.body.itemType,
    itemName: req.body.itemName,
    description: req.body.description,
    category: req.body.category,
    location: req.body.location,
    dateLostFound: req.body.dateLostFound,
    images: req.files ? req.files.map(f => `/uploads/lostfound/${f.filename}`) : [],
    contactNumber: req.body.contactNumber,
  });

  return successResponse(res, "Lost & found item created successfully", { item }, 201);
});

module.exports = {
  // Polls
  listPolls,
  votePoll,
  // Discussions
  listDiscussions,
  createDiscussion,
  addDiscussionComment,
  // Events
  listEvents,
  registerForEvent,
  listMyEventRegistrations,
  // Marketplace
  listMarketplaceItems,
  createMarketplaceItem,
  // Lost & Found
  listLostFoundItems,
  createLostFoundItem,
};
