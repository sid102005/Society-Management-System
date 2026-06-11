const Resident = require("../models/Resident");

async function authMiddleware(req, res, next) {
  if (!req.session || !req.session.residentId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
      errors: [],
    });
  }

  const resident = await Resident.findById(req.session.residentId).select(
    "-password",
  );

  if (!resident) {
    return res.status(401).json({
      success: false,
      message: "Session is invalid",
      errors: [],
    });
  }

  req.currentResident = resident;
  return next();
}

module.exports = authMiddleware;
