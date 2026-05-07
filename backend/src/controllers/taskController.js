import Task from '../models/Task.js';
import Subtask from '../models/Subtask.js';
import Project from '../models/Project.js';
import { sendSuccess, sendError, logActivity } from '../utils/helpers.js';
import { getFileUrl } from '../middleware/upload.js';

export const getTasksByProject = async (req, res) => {
  try {
    const { status, priority, assignedTo } = req.query;
    const filter = { projectId: req.params.projectId };

    // Client: only see tasks explicitly marked visible
    if (req.user.role === 'client') filter.clientVisible = true;

    // Employee: only see tasks assigned to them
    if (req.user.role === 'employee') filter.assignedTo = req.user._id;

    if (status)     filter.status     = status;
    if (priority)   filter.priority   = priority;
    if (assignedTo) filter.assignedTo = assignedTo;

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name')
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 });

    sendSuccess(res, tasks);
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name')
      .populate('approvedBy', 'name');

    if (!task) return sendError(res, 'Task not found', 404);
    sendSuccess(res, task);
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

export const createTask = async (req, res) => {
  try {
    const {
      title, description, projectId, priority, dueDate,
      estimatedTime, proofRequired,
      clientVisible,  // 'true' or 'false' string from FormData
      assignAll,      // 'true' → assign to all project employees
      assignedTo,     // specific employee id (if assignAll is false)
    } = req.body;

    // Parse booleans (FormData sends strings)
    const isClientVisible = clientVisible !== 'false';
    const isAssignAll     = assignAll === 'true';

    // Build images array from uploaded files
    const images = (req.files || []).map((file) => {
      const { filename, url } = getFileUrl(req, file.filename);
      return { filename, url };
    });

    if (isAssignAll) {
      // Create one task per employee in the project
      const project = await Project.findById(projectId);
      if (!project) return sendError(res, 'Project not found', 404);

      const tasks = await Promise.all(
        project.employees.map((empId) =>
          Task.create({
            title, description, projectId, priority, dueDate, estimatedTime,
            proofRequired: proofRequired === 'true',
            clientVisible: isClientVisible,
            assignedTo: empId,
            createdBy: req.user._id,
            images,
          })
        )
      );

      await logActivity(req.user._id, 'created task for all employees', 'task', tasks[0]._id, { title });
      return sendSuccess(res, tasks, 'Tasks created for all employees', 201);
    }

    // Single task
    const task = await Task.create({
      title, description, projectId, priority, dueDate, estimatedTime,
      proofRequired: proofRequired === 'true',
      clientVisible: isClientVisible,
      assignedTo: assignedTo || undefined,
      createdBy: req.user._id,
      images,
    });

    await logActivity(req.user._id, 'created task', 'task', task._id, { title });
    sendSuccess(res, task, 'Task created', 201);
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('assignedTo', 'name email avatar');

    if (!task) return sendError(res, 'Task not found', 404);
    await logActivity(req.user._id, `updated task to ${task.status}`, 'task', task._id);
    sendSuccess(res, task, 'Task updated');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return sendError(res, 'Task not found', 404);
    await logActivity(req.user._id, 'deleted task', 'task', task._id);
    sendSuccess(res, null, 'Task deleted');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

export const uploadTaskImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) return sendError(res, 'No files uploaded', 400);

    const task = await Task.findById(req.params.id);
    if (!task) return sendError(res, 'Task not found', 404);

    const newImages = req.files.map((file) => {
      const { filename, url } = getFileUrl(req, file.filename);
      return { filename, url, caption: req.body.caption || '' };
    });

    task.images.push(...newImages);
    await task.save();

    await logActivity(req.user._id, 'uploaded images to task', 'task', task._id);
    sendSuccess(res, task.images, 'Images uploaded');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

export const approveTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', approvedBy: req.user._id, approvedAt: new Date() },
      { new: true }
    );
    if (!task) return sendError(res, 'Task not found', 404);
    await logActivity(req.user._id, 'approved task', 'task', task._id);
    sendSuccess(res, task, 'Task approved');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

export const rejectTask = async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', rejectionReason },
      { new: true }
    );
    if (!task) return sendError(res, 'Task not found', 404);

    await Subtask.create({
      parentTaskId: task._id,
      projectId:    task.projectId,
      title:        `Rework: ${task.title}`,
      description:  rejectionReason,
      assignedTo:   task.assignedTo,
      createdBy:    req.user._id,
    });

    await logActivity(req.user._id, 'rejected task', 'task', task._id, { reason: rejectionReason });
    sendSuccess(res, task, 'Task rejected and rework subtask created');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};
