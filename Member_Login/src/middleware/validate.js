const fs = require("fs");
const { validationResult } = require("express-validator");

function validateRequest(req, res, next) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const uploadedFiles = [];

    if (req.file) {
      uploadedFiles.push(req.file);
    }

    if (Array.isArray(req.files)) {
      uploadedFiles.push(...req.files);
    } else if (req.files && typeof req.files === "object") {
      Object.values(req.files).forEach((files) => {
        if (Array.isArray(files)) {
          uploadedFiles.push(...files);
        }
      });
    }

    uploadedFiles.forEach((file) => {
      if (file && file.path) {
        fs.unlink(file.path, (err) => {
          if (err) console.error("Failed to delete orphaned file:", err);
        });
      }
    });

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    });
  }

  return next();
}

module.exports = validateRequest;
