const Notice = require("../models/Notice");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/appError");
const { successResponse } = require("../utils/response");

const listNotices = asyncHandler(async (req, res) => {
  const notices = await Notice.find().sort({ createdAt: -1 });
  return successResponse(res, "Notices fetched successfully", { notices });
});

const getNoticeById = asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id);

  if (!notice) {
    throw new AppError(404, "Notice not found");
  }

  return successResponse(res, "Notice fetched successfully", { notice });
});

module.exports = {
  listNotices,
  getNoticeById,
};
