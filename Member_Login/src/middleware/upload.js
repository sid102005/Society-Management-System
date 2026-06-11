const fs = require("fs");
const path = require("path");
const multer = require("multer");

function ensureDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function createUploader(subDirectory) {
  const uploadRoot = path.join(__dirname, "..", "uploads", subDirectory);
  ensureDirectory(uploadRoot);

  const storage = multer.diskStorage({
    destination: (req, file, callback) => callback(null, uploadRoot),
    filename: (req, file, callback) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const extension = path.extname(file.originalname);
      callback(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
    },
  });

  const fileFilter = (req, file, callback) => {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      const error = new Error(
        "Invalid file type. Only JPEG, PNG, WEBP, and PDF files are allowed.",
      );
      error.statusCode = 400;
      callback(error, false);
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  });
}

module.exports = {
  createUploader,
};
