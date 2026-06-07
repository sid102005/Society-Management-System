const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['announcement', 'alert', 'maintenance', 'emergency', 'event', 'other'], default: 'announcement' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  publishedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  publishedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  targetRoles: [{ type: String, enum: ['staff', 'member', 'admin', 'all'] }],
  targetFlats: [{ type: String }], // empty = all flats
  attachments: [{ type: String }],
  viewedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notice', NoticeSchema);
