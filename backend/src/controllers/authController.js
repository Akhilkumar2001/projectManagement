import User from '../models/User.js';
import { generateToken, sendSuccess, sendError } from '../utils/helpers.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (await User.findOne({ email })) {
      return sendError(res, 'Email already registered', 409);
    }

    const user = await User.create({ name, email, password, role: role || 'employee' });
    const token = generateToken(user._id);

    sendSuccess(res, { token, user }, 'Registered successfully', 201);
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return sendError(res, 'Invalid email or password', 401);
    }

    if (!user.isActive) {
      return sendError(res, 'Account is deactivated', 403);
    }

    const token = generateToken(user._id);
    user.password = undefined;

    sendSuccess(res, { token, user }, 'Login successful');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

export const getMe = async (req, res) => {
  sendSuccess(res, req.user);
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (!(await user.comparePassword(currentPassword))) {
      return sendError(res, 'Current password is incorrect', 401);
    }

    user.password = newPassword;
    await user.save();

    sendSuccess(res, null, 'Password changed successfully');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};
