import Recruiter from '../models/Recruiter.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new recruiter
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const recruiterExists = await Recruiter.findOne({ email });

    if (recruiterExists) {
      return res.status(400).json({ success: false, message: 'Recruiter already exists' });
    }

    const recruiter = await Recruiter.create({
      name,
      email,
      password
    });

    if (recruiter) {
      res.status(201).json({
        success: true,
        data: {
          _id: recruiter._id,
          name: recruiter.name,
          email: recruiter.email,
          token: generateToken(recruiter._id)
        }
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid recruiter data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Auth recruiter & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const recruiter = await Recruiter.findOne({ email }).select('+password');

    if (recruiter && (await recruiter.matchPassword(password))) {
      res.json({
        success: true,
        data: {
          _id: recruiter._id,
          name: recruiter.name,
          email: recruiter.email,
          token: generateToken(recruiter._id)
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get recruiter profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(req.user.id);
    res.json({ success: true, data: recruiter });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
