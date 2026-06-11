const Notification = require("../models/Notification");

async function createNotification({ residentId = null, title, message }) {
  return Notification.create({ residentId, title, message });
}

module.exports = {
  createNotification,
};
