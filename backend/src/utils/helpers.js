import jwt from 'jsonwebtoken';
import ActivityLog from '../models/ActivityLog.js';

export const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

export const logActivity = async (userId, action, entity, entityId, details = {}) => {
  try {
    await ActivityLog.create({ userId, action, entity, entityId, details });
  } catch (err) {
    console.error('Activity log error:', err.message);
  }
};

export const sendSuccess = (res, data, message = 'Success', statusCode = 200) =>
  res.status(statusCode).json({ success: true, message, data });

export const sendError = (res, message = 'Error', statusCode = 400) =>
  res.status(statusCode).json({ success: false, message });
