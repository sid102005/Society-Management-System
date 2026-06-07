const Incident = require('../models/Incident');
const Alert = require('../models/Alert');

// Feature #22: Create incident report
exports.createIncident = async (req, res) => {
  try {
    const { incidentType, title, description, location, severity, witnesses, gpsLocation } = req.body;

    const incident = new Incident({
      incidentType,
      title,
      description,
      location,
      severity,
      witnesses,
      gpsLocation,
      reportedBy: req.user.id
    });

    await incident.save();

    // Create alert for admin/staff (Feature #23 - SOS)
    if (severity === 'critical') {
      await Alert.create({
        type: 'incident',
        severity: 'critical',
        title: `CRITICAL: ${title}`,
        message: description,
        relatedTo: incident._id.toString(),
        triggeredBy: req.user.id,
        recipientRoles: ['admin', 'staff'],
        gpsLocation
      });
    }

    res.status(201).json({ message: 'Incident reported', incident });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Feature #23: SOS / Panic button
exports.sendSOS = async (req, res) => {
  try {
    const { title, gpsLocation } = req.body;

    const alert = await Alert.create({
      type: 'sos',
      severity: 'critical',
      title: title || 'SOS EMERGENCY',
      message: `Emergency SOS triggered by ${req.user.id}`,
      triggeredBy: req.user.id,
      location: gpsLocation,
      recipientRoles: ['admin', 'staff'],
      status: 'active'
    });

    // Also create incident record
    const incident = new Incident({
      incidentType: 'emergency',
      title: title || 'SOS Emergency',
      description: 'Emergency SOS button triggered',
      location: 'Current location',
      severity: 'critical',
      reportedBy: req.user.id,
      gpsLocation
    });

    await incident.save();

    res.json({ message: 'SOS alert sent', alert, incident });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get incidents
exports.getIncidents = async (req, res) => {
  try {
    const { status, incidentType, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (incidentType) query.incidentType = incidentType;

    const skip = (page - 1) * limit;
    const incidents = await Incident.find(query)
      .populate('reportedBy', 'name phone')
      .populate('assignedTo', 'name')
      .sort({ reportedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Incident.countDocuments(query);

    res.json({
      incidents,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single incident
exports.getIncident = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id)
      .populate('reportedBy', 'name phone')
      .populate('assignedTo', 'name');

    if (!incident) return res.status(404).json({ message: 'Incident not found' });
    res.json(incident);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update incident (admin)
exports.updateIncident = async (req, res) => {
  try {
    const { status, assignedTo, investigation, actionTaken } = req.body;
    const incident = await Incident.findById(req.params.id);

    if (!incident) return res.status(404).json({ message: 'Incident not found' });

    if (status) incident.status = status;
    if (assignedTo) incident.assignedTo = assignedTo;
    if (investigation) incident.investigation = investigation;
    if (actionTaken) incident.actionTaken = actionTaken;

    if (status === 'resolved' || status === 'closed') {
      incident.resolvedAt = new Date();
    }

    await incident.save();
    res.json({ message: 'Incident updated', incident });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
