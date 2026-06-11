function errorHandler(err, req, res, next) {
  console.error("Error handler caught error:", err);
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || [];

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
    errors = Object.keys(err.errors).map((key) => ({
      field: key,
      message: err.errors[key].message,
    }));
  }

  // MongoDB duplicate key error (e.g. duplicate email/phone)
  if (err.code === 11000) {
    statusCode = 400;
    const key = Object.keys(err.keyValue || {})[0] || "field";
    const val = err.keyValue ? err.keyValue[key] : "";
    message = `${key.charAt(0).toUpperCase() + key.slice(1)} already exists.`;
    errors = [{
      field: key,
      message: `${key.charAt(0).toUpperCase() + key.slice(1)} '${val}' is already registered.`
    }];
  }

  // Multer errors (e.g., file size limit exceeded)
  if (err.name === "MulterError") {
    statusCode = 400;
    if (err.code === "LIMIT_FILE_SIZE") {
      message = "File is too large. Maximum size allowed is 10 MB.";
    } else {
      message = `File upload error: ${err.message}`;
    }
    errors = [{
      field: "file",
      message
    }];
  }

  if (res.headersSent) {
    return next(err);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
}

module.exports = errorHandler;
