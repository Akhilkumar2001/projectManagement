import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/helpers.js';

export const getAllUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const users = await User.find(filter).sort({ createdAt: -1 });
    sendSuccess(res, users);
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 'User not found', 404);
    sendSuccess(res, user);
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, department } = req.body;

    if (await User.findOne({ email })) {
      return sendError(res, 'Email already registered', 409);
    }

    const user = await User.create({ name, email, password, role, phone, department });
    sendSuccess(res, user, 'User created', 201);
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

export const updateUser = async (req, res) => {
  try {
    // Prevent admin from deactivating their own account
    if (req.params.id === req.user._id.toString() && req.body.isActive === false) {
      return sendError(res, 'You cannot deactivate your own account', 403);
    }

    const { name, phone, department, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, phone, department, isActive },
      { new: true, runValidators: true }
    );
    if (!user) return sendError(res, 'User not found', 404);
    sendSuccess(res, user, 'User updated');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return sendError(res, 'User not found', 404);
    sendSuccess(res, null, 'User deleted');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, department } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, department },
      { new: true, runValidators: true }
    );
    sendSuccess(res, user, 'Profile updated');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};
