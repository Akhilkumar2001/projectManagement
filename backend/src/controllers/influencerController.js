import Influencer from '../models/Influencer.js';
import { sendSuccess, sendError } from '../utils/helpers.js';

export const getInfluencers = async (req, res) => {
  try {
    const filter = { campaignId: req.params.campaignId };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.platform) filter.platform = req.query.platform;

    const influencers = await Influencer.find(filter).sort({ createdAt: -1 });
    sendSuccess(res, influencers);
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

export const createInfluencer = async (req, res) => {
  try {
    const influencer = await Influencer.create({ ...req.body, campaignId: req.params.campaignId });
    sendSuccess(res, influencer, 'Influencer added', 201);
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

export const updateInfluencer = async (req, res) => {
  try {
    const influencer = await Influencer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!influencer) return sendError(res, 'Influencer not found', 404);
    sendSuccess(res, influencer, 'Influencer updated');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

export const deleteInfluencer = async (req, res) => {
  try {
    const influencer = await Influencer.findByIdAndDelete(req.params.id);
    if (!influencer) return sendError(res, 'Influencer not found', 404);
    sendSuccess(res, null, 'Influencer removed');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};
