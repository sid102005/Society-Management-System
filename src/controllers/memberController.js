const User = require('../models/User');

// Feature #13: Member directory
exports.getMemberDirectory = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const members = await User.find({
      role: 'member',
      isActive: true,
      allowDirectoryListing: true
    })
      .select('name flat phone email profilePhoto bio')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments({
      role: 'member',
      isActive: true,
      allowDirectoryListing: true
    });

    res.json({
      members,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get member profile (within permission)
exports.getMemberProfile = async (req, res) => {
  try {
    const member = await User.findById(req.params.id)
      .select('name flat phone email profilePhoto bio');

    if (!member) return res.status(404).json({ message: 'Member not found' });

    if (!member.allowDirectoryListing) {
      return res.status(403).json({ message: 'Member profile is private' });
    }

    res.json({ member });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update own profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, emergencyContact, allowDirectoryListing, profilePhoto } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (emergencyContact) user.emergencyContact = emergencyContact;
    if (allowDirectoryListing !== undefined) user.allowDirectoryListing = allowDirectoryListing;
    if (profilePhoto) user.profilePhoto = profilePhoto;

    user.updatedAt = new Date();
    await user.save();

    res.json({ message: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
