import Project from '../models/Project.js';
import { sendSuccess, sendError, logActivity } from '../utils/helpers.js';

export const getAllProjects = async (req, res) => {
  try {
    const { status, priority, search } = req.query;
    const filter = {};

    // Clients see only their projects
    if (req.user.role === 'client') filter.clientId = req.user._id;
    // Employees see only assigned projects
    if (req.user.role === 'employee') filter.employees = req.user._id;

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const projects = await Project.find(filter)
      .populate('clientId', 'name email')
      .populate('employees', 'name email role')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    sendSuccess(res, projects);
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('clientId', 'name email')
      .populate('employees', 'name email role avatar')
      .populate('createdBy', 'name');

    if (!project) return sendError(res, 'Project not found', 404);
    sendSuccess(res, project);
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

export const createProject = async (req, res) => {
  try {
    const project = await Project.create({ ...req.body, createdBy: req.user._id });
    await logActivity(req.user._id, 'created project', 'project', project._id, { name: project.name });
    sendSuccess(res, project, 'Project created', 201);
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) return sendError(res, 'Project not found', 404);
    await logActivity(req.user._id, 'updated project', 'project', project._id, { name: project.name });
    sendSuccess(res, project, 'Project updated');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return sendError(res, 'Project not found', 404);
    await logActivity(req.user._id, 'deleted project', 'project', project._id, { name: project.name });
    sendSuccess(res, null, 'Project deleted');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};
