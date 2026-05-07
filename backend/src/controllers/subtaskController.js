import Subtask from '../models/Subtask.js';
import { sendSuccess, sendError, logActivity } from '../utils/helpers.js';
import { getFileUrl } from '../middleware/upload.js';

export const getSubtasksByTask = async (req, res) => {
  try {
    const subtasks = await Subtask.find({ parentTaskId: req.params.taskId })
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    sendSuccess(res, subtasks);
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

export const updateSubtask = async (req, res) => {
  try {
    const subtask = await Subtask.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!subtask) return sendError(res, 'Subtask not found', 404);
    await logActivity(req.user._id, `updated subtask to ${subtask.status}`, 'subtask', subtask._id);
    sendSuccess(res, subtask, 'Subtask updated');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

export const uploadSubtaskImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) return sendError(res, 'No files uploaded', 400);

    const subtask = await Subtask.findById(req.params.id);
    if (!subtask) return sendError(res, 'Subtask not found', 404);

    const newImages = req.files.map((file) => {
      const { filename, url } = getFileUrl(req, file.filename);
      return { filename, url };
    });

    subtask.images.push(...newImages);
    await subtask.save();

    sendSuccess(res, subtask.images, 'Images uploaded');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};
