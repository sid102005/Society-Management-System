const Complaint = require('../models/Complaint');

// Feature #17: Create complaint
exports.createComplaint = async (req, res) => {
  try {
    const { title, description, category, severity, flat, dueDate } = req.body;
    
    const complaint = new Complaint({
      title,
      description,
      category,
      severity,
      flat,
      filedBy: req.user.id,
      dueDate,
      statusHistory: [{
        status: 'open',
        changedAt: new Date(),
        changedBy: req.user.id,
        comment: 'Complaint filed'
      }]
    });

    await complaint.save();
    res.status(201).json({ message: 'Complaint created', data: complaint });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Feature #17: Get assigned complaints
exports.getAssignedComplaints = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const complaints = await Complaint.find({
      $or: [
        { filedBy: req.user.id },
        { assignedTo: req.user.id }
      ]
    })
      .populate('filedBy', 'name phone flat')
      .populate('assignedTo', 'name phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Complaint.countDocuments({
      $or: [
        { filedBy: req.user.id },
        { assignedTo: req.user.id }
      ]
    });

    res.json({
      complaints,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Feature #18: Update complaint status
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status, resolution, comment } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    complaint.status = status;
    if (resolution) complaint.resolution = resolution;

    complaint.statusHistory.push({
      status,
      changedAt: new Date(),
      changedBy: req.user.id,
      comment
    });

    if (status === 'resolved' || status === 'closed') {
      complaint.completedAt = new Date();
    }

    await complaint.save();
    res.json({ message: 'Complaint updated', complaint });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Feature #19: Upload photo proof
exports.uploadProofPhotos = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    // Check authorization - only assigned staff or filer can upload proof
    if (
  complaint.assignedTo?.toString() !== req.user.id &&
  complaint.filedBy?.toString() !== req.user.id
) {
  return res.status(403).json({
    message: 'Unauthorized to upload proof'
  });
}

    const { photos, description } = req.body;

    if (!photos || !Array.isArray(photos) || photos.length === 0) {
      return res.status(400).json({ message: 'At least one photo URL required' });
    }

    // Add proof photos with metadata
    const newProofs = photos.map(photo => ({
      url: photo,
      uploadedBy: req.user.id,
      uploadedAt: new Date(),
      description: description || ''
    }));

    if (!complaint.proofPhotos) {
      complaint.proofPhotos = [];
    }

    complaint.proofPhotos.push(...newProofs);
    complaint.status = 'in-progress';
    
    // Update status history
    complaint.statusHistory.push({
      status: 'in-progress',
      changedAt: new Date(),
      changedBy: req.user.id,
      comment: 'Proof photos uploaded'
    });

    await complaint.save();
    
    res.json({ 
      message: 'Proof photos uploaded successfully', 
      proofCount: complaint.proofPhotos.length,
      complaint 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Feature #19: Get complaint proof photos
exports.getProofPhotos = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('proofPhotos.uploadedBy', 'name');

    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    res.json({
      complaintId: complaint._id,
      title: complaint.title,
      status: complaint.status,
      proofPhotos: complaint.proofPhotos || [],
      totalPhotos: complaint.proofPhotos ? complaint.proofPhotos.length : 0
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Feature #19: Delete proof photo
exports.deleteProofPhoto = async (req, res) => {
  try {
    const { photoId } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    // Remove photo from array
    complaint.proofPhotos = complaint.proofPhotos.filter(p => p._id.toString() !== photoId);
    await complaint.save();

    res.json({ 
      message: 'Photo deleted',
      proofPhotos: complaint.proofPhotos,
      totalPhotos: complaint.proofPhotos.length
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all complaints (admin)
exports.getAllComplaints = async (req, res) => {
  try {
    const { status, category, flat, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (flat) query.flat = flat;

    const skip = (page - 1) * limit;
    const complaints = await Complaint.find(query)
      .populate('filedBy', 'name phone flat')
      .populate('assignedTo', 'name phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Complaint.countDocuments(query);

    res.json({
      complaints,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single complaint
exports.getComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('filedBy', 'name phone flat')
      .populate('assignedTo', 'name phone')
      .populate('statusHistory.changedBy', 'name');

    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Assign complaint (admin)
exports.assignComplaint = async (req, res) => {
  try {
    const { assignedTo, dueDate } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    complaint.assignedTo = assignedTo;
    if (dueDate) complaint.dueDate = dueDate;

    await complaint.save();
    res.json({ message: 'Complaint assigned', complaint });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get complaint statistics
exports.getComplaintStats = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const byStatus = await Complaint.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const byCategory = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json({
      total: totalComplaints,
      byStatus: Object.fromEntries(byStatus.map(x => [x._id, x.count])),
      byCategory: Object.fromEntries(byCategory.map(x => [x._id, x.count]))
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
