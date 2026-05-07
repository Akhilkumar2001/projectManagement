import ActivityLog from '../models/ActivityLog.js';
import { sendSuccess, sendError } from '../utils/helpers.js';

export const getActivityLogs = async (req, res) => {
  try {
    const { entity, entityId, userId, limit = 50 } = req.query;
    const filter = {};

    if (entity) filter.entity = entity;
    if (entityId) filter.entityId = entityId;
    if (userId) filter.userId = userId;

    const logs = await ActivityLog.find(filter)
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    sendSuccess(res, logs);
  } catch (err) {
    sendError(res, err.message, 500);
  }
};
