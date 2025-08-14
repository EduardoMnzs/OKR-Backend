const db = require('../models');
const User = db.User;
const Profile = db.Profile;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { email, password, first_name, last_name } = req.body;
    const user = await User.create({ email, password });
    const profile = await Profile.create({ id: user.id, first_name, last_name });
    
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.status(201).json({ 
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        profile: {
          id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          created_at: profile.createdAt,
        }
      }, 
      token 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ 
      where: { email },
      include: [{ model: Profile, as: 'profile' }]
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Login failed!' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Login failed!' });
    }
    
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.status(200).json({ 
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        profile: {
          id: user.profile.id,
          first_name: user.profile.first_name,
          last_name: user.profile.last_name,
          created_at: user.profile.createdAt,
        }
      }, 
      token 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};