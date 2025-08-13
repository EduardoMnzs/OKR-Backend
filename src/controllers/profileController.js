const db = require('../models');
const Profile = db.Profile;

exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findByPk(req.user.id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const [updated] = await Profile.update(req.body, {
      where: { id: req.user.id }
    });
    if (updated) {
      const updatedProfile = await Profile.findByPk(req.user.id);
      return res.status(200).json(updatedProfile);
    }
    throw new Error('Profile not found');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};