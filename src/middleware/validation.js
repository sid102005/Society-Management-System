const Joi = require('joi');

const schemas = {
  // Auth schemas
  register: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
    email: Joi.string().email(),
    password: Joi.string().min(6).max(30).required(),
    role: Joi.string().valid('staff', 'member', 'admin').required(),
    flat: Joi.string(),
  }),

  login: Joi.object({
    phone: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string().required(),
  }).or('phone', 'email'),

  // Visitor schemas
  visitorEntry: Joi.object({
    name: Joi.string().min(2).required(),
    phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
    flatToVisit: Joi.string().required(),
    vehicleNumber: Joi.string(),
    purpose: Joi.string(),
    preApproved: Joi.boolean(),
  }),

  visitApproval: Joi.object({
    staffId: Joi.string().required(),
    otp: Joi.string(),
  }),

  visitExit: Joi.object({
    staffId: Joi.string().required(),
  }),

  // Complaint schemas
  complaintCreate: Joi.object({
    title: Joi.string().min(5).max(100).required(),
    description: Joi.string().min(10).required(),
    category: Joi.string().valid('maintenance', 'noise', 'parking', 'cleanliness', 'security', 'other'),
    severity: Joi.string().valid('low', 'medium', 'high', 'critical'),
    flat: Joi.string().required(),
  }),

  complaintUpdate: Joi.object({
    status: Joi.string().valid('open', 'in-progress', 'resolved', 'escalated', 'closed'),
    resolution: Joi.string(),
    comment: Joi.string(),
  }),

  // Task schemas
  taskCreate: Joi.object({
    title: Joi.string().min(5).required(),
    description: Joi.string(),
    category: Joi.string().valid('cleaning', 'maintenance', 'security', 'patrol', 'other'),
    assignedTo: Joi.string().required(),
    dueDate: Joi.date().required(),
    priority: Joi.string().valid('low', 'medium', 'high'),
  }),

  // Delivery schemas
  deliveryEntry: Joi.object({
    courierName: Joi.string().required(),
    courierCompany: Joi.string().required(),
    phoneNumber: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
    vehicleNumber: Joi.string(),
    flatNumber: Joi.string().required(),
    numberOfPackages: Joi.number().min(1).required(),
  }),

  // Pre-approved visitor schemas
  preApprovedCreate: Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().pattern(/^[6-9]\d{9}$/),
    relation: Joi.string().required(),
    vehicleNumber: Joi.string(),
    expiryDate: Joi.date(),
    notes: Joi.string(),
  }),

  // Incident schemas
  incidentCreate: Joi.object({
    incidentType: Joi.string().valid('accident', 'fight', 'theft', 'fire', 'medical', 'suspicious', 'vandalism', 'other').required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    severity: Joi.string().valid('low', 'medium', 'high', 'critical'),
    witnesses: Joi.array().items(Joi.string()),
  }),

  // Attendance schemas
  attendanceCheckIn: Joi.object({
    latitude: Joi.number(),
    longitude: Joi.number(),
  }),

  // Leave schemas
  leaveApply: Joi.object({
    leaveType: Joi.string().valid('sick', 'casual', 'personal', 'emergency', 'annual').required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    reason: Joi.string().required(),
  }),

  // Notice schemas
  noticeCreate: Joi.object({
    title: Joi.string().min(5).required(),
    content: Joi.string().min(10).required(),
    type: Joi.string().valid('announcement', 'alert', 'maintenance', 'emergency', 'event', 'other'),
    priority: Joi.string().valid('low', 'medium', 'high', 'critical'),
    targetRoles: Joi.array().items(Joi.string()),
  }),

  // Communication schemas
  messageCreate: Joi.object({
    recipientId: Joi.string().required(),
    content: Joi.string(),
    messageType: Joi.string().valid('text', 'image', 'document', 'audio', 'video'),
  }),
};

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map(d => d.message).join(', ');
    return res.status(400).json({ message: 'Validation error', errors: messages });
  }
  req.body = value;
  next();
};

module.exports = { validate, schemas };
