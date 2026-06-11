const crypto = require("crypto");

function generateVisitorOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function generateAuthorizationCode() {
  return `AUTH-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
}

module.exports = {
  generateVisitorOtp,
  generateAuthorizationCode,
};
