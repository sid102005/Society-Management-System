const Notice = require('../models/Notice');

// Feature #31: Create notice/announcement
exports.createNotice = async (req, res) => {
  try {
    const { title, content, type, priority, targetRoles, targetFlats, expiresAt, attachments } = req.body;

    const notice = new Notice({
      title,
      content,
      type,
      priority,
      publishedBy: req.user.id,
      targetRoles: targetRoles || ['all'],
      targetFlats: targetFlats || [],
      expiresAt,
      attachments: attachments || []
    });

    await notice.save();
    res.status(201).json({ message: 'Notice published', notice });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get notices for user
exports.getNotices = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const query = {
      isActive: true,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: new Date() } }
      ]
    };

    // Filter by role and flat
    const roleQuery = { $in: ['all', req.user.role] };
    query.$or = [
      { targetRoles: roleQuery },
      { targetFlats: { $in: [req.user.flat] } }
    ];

    const notices = await Notice.find(query)
      .populate('publishedBy', 'name')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Notice.countDocuments(query);

    res.json({
      notices,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark notice as read
exports.markNoticeAsRead = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });

    if (!notice.viewedBy.includes(req.user.id)) {
      notice.viewedBy.push(req.user.id);
      await notice.save();
    }

    res.json({ message: 'Notice marked as read', notice });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all notices (admin)
exports.getAllNotices = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const notices = await Notice.find()
      .populate('publishedBy', 'name')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Notice.countDocuments();

    res.json({
      notices,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single notice
exports.getNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id)
      .populate('publishedBy', 'name');

    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    res.json(notice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update notice
exports.updateNotice = async (req, res) => {
  try {
    const { title, content, type, priority, targetRoles, expiresAt } = req.body;
    const notice = await Notice.findById(req.params.id);

    if (!notice) return res.status(404).json({ message: 'Notice not found' });

    if (title) notice.title = title;
    if (content) notice.content = content;
    if (type) notice.type = type;
    if (priority) notice.priority = priority;
    if (targetRoles) notice.targetRoles = targetRoles;
    if (expiresAt) notice.expiresAt = expiresAt;

    notice.updatedAt = new Date();
    await notice.save();

    res.json({ message: 'Notice updated', notice });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Deactivate notice
exports.deactivateNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });

    notice.isActive = false;
    await notice.save();

    res.json({ message: 'Notice deactivated', notice });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
