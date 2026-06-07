const mongoose = require('mongoose');

const CommunicationSchema = new mongoose.Schema({
  type: { type: String, enum: ['message', 'call', 'intercom', 'broadcast'], required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // null for broadcast
  content: { type: String },
  messageType: { type: String, enum: ['text', 'image', 'document', 'audio', 'video'], default: 'text' },
  attachmentUrl: { type: String },
  callDuration: { type: Number }, // seconds
  callStatus: { type: String, enum: ['initiated', 'ringing', 'connected', 'ended', 'missed', 'declined'], default: 'initiated' },
  intercomTarget: { type: String }, // flat number or department
  isRead: { type: Boolean, default: false },
  isDelivered: { type: Boolean, default: false },
  readAt: { type: Date },
  deliveredAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Communication', CommunicationSchema);
