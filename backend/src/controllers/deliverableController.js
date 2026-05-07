import Deliverable from '../models/Deliverable.js';
import { sendSuccess, sendError } from '../utils/helpers.js';

export const getDeliverables = async (req, res) => {
  try {
    const filter = { campaignId: req.params.campaignId };
    if (req.query.status) filter.status = req.query.status;

    const deliverables = await Deliverable.find(filter)
      .populate('influencerId', 'name handle platform')
      .sort({ dueDate: 1 });
    sendSuccess(res, deliverables);
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

export const createDeliverable = async (req, res) => {
  try {
    const deliverable = await Deliverable.create({ ...req.body, campaignId: req.params.campaignId });
    const populated = await deliverable.populate('influencerId', 'name handle platform');
    sendSuccess(res, populated, 'Deliverable added', 201);
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

export const updateDeliverable = async (req, res) => {
  try {
    const deliverable = await Deliverable.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('influencerId', 'name handle platform');
    if (!deliverable) return sendError(res, 'Deliverable not found', 404);
    sendSuccess(res, deliverable, 'Deliverable updated');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

export const deleteDeliverable = async (req, res) => {
  try {
    const deliverable = await Deliverable.findByIdAndDelete(req.params.id);
    if (!deliverable) return sendError(res, 'Deliverable not found', 404);
    sendSuccess(res, null, 'Deliverable removed');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};
