import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered.' });
    }
    const user = await User.create({ username, email, password });
    const token = signToken(user._id);
    return res.status(201).json({ token, user: user.toSafeObject() });
  } catch (err) {
    return res.status(500).json({ message: 'Registration failed.', error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const token = signToken(user._id);
    return res.json({ token, user: user.toSafeObject() });
  } catch (err) {
    return res.status(500).json({ message: 'Login failed.', error: err.message });
  }
};

export const getMe = async (req, res) => {
  return res.json({ user: req.user.toSafeObject() });
};
