const Communication = require('../models/Communication');

// Feature #30: Send message
exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, content, messageType, attachmentUrl } = req.body;

    const message = new Communication({
      type: 'message',
      senderId: req.user.id,
      recipientId,
      content,
      messageType: messageType || 'text',
      attachmentUrl
    });

    await message.save();

    res.json({ message: 'Message sent', data: message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Feature #30: Get messages
exports.getMessages = async (req, res) => {
  try {
    const { userId, page = 1, limit = 50 } = req.query;

    const query = {
      $or: [
        { senderId: req.user.id, recipientId: userId },
        { senderId: userId, recipientId: req.user.id }
      ]
    };

    const skip = (page - 1) * limit;
    const messages = await Communication.find(query)
      .populate('senderId', 'name')
      .populate('recipientId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Communication.countDocuments(query);

    // Mark as read
    await Communication.updateMany(
      { senderId: userId, recipientId: req.user.id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.json({
      messages: messages.reverse(),
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Feature #29: Start intercom calling
exports.initiateCall = async (req, res) => {
  try {
    const { recipientId, intercomTarget } = req.body;

    const call = new Communication({
      type: 'call',
      senderId: req.user.id,
      recipientId,
      intercomTarget: intercomTarget || null,
      callStatus: 'initiated'
    });

    await call.save();

    res.json({ message: 'Call initiated', call });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update call status
exports.updateCallStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const call = await Communication.findById(req.params.id);

    if (!call) return res.status(404).json({ message: 'Call not found' });

    call.callStatus = status;

    if (status === 'ended') {
      // Calculate call duration if has timestamps
      call.callDuration = Math.floor(Math.random() * 600); // placeholder
    }

    await call.save();

    res.json({ message: 'Call updated', call });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get conversation with user
exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Communication.find({
      type: 'message',
      $or: [
        { senderId: req.user.id, recipientId: userId },
        { senderId: userId, recipientId: req.user.id }
      ]
    })
      .populate('senderId', 'name')
      .populate('recipientId', 'name')
      .sort({ createdAt: 1 });

    res.json({ messages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get unread messages count
exports.getUnreadCount = async (req, res) => {
  try {
    const unreadCount = await Communication.countDocuments({
      type: 'message',
      recipientId: req.user.id,
      isRead: false
    });

    res.json({ unreadCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get recent chats
exports.getRecentChats = async (req, res) => {
  try {
    const recentChats = await Communication.aggregate([
      {
        $match: {
          type: 'message',
          $or: [
            { senderId: req.user.id },
            { recipientId: req.user.id }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$senderId', req.user.id] },
              '$recipientId',
              '$senderId'
            ]
          },
          lastMessage: { $first: '$content' },
          lastMessageTime: { $first: '$createdAt' }
        }
      },
      {
        $limit: 20
      }
    ]);

    res.json({ chats: recentChats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
