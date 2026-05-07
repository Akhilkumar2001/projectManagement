import Campaign from '../models/Campaign.js';
import Influencer from '../models/Influencer.js';
import Deliverable from '../models/Deliverable.js';
import BudgetPerformance from '../models/BudgetPerformance.js';
import { sendSuccess, sendError, logActivity } from '../utils/helpers.js';

// ─── Campaign CRUD ─────────────────────────────────────────────
export const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find()
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    sendSuccess(res, campaigns);
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

export const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate('createdBy', 'name');
    if (!campaign) return sendError(res, 'Campaign not found', 404);
    sendSuccess(res, campaign);
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

export const createCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.create({ ...req.body, createdBy: req.user._id });
    await logActivity(req.user._id, 'created campaign', 'project', campaign._id, { name: campaign.name });
    sendSuccess(res, campaign, 'Campaign created', 201);
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

export const updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!campaign) return sendError(res, 'Campaign not found', 404);
    sendSuccess(res, campaign, 'Campaign updated');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

export const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!campaign) return sendError(res, 'Campaign not found', 404);
    // Cascade delete all related data
    await Influencer.deleteMany({ campaignId: req.params.id });
    await Deliverable.deleteMany({ campaignId: req.params.id });
    await BudgetPerformance.deleteMany({ campaignId: req.params.id });
    sendSuccess(res, null, 'Campaign and all related data deleted');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

// ─── Dashboard stats for a campaign ────────────────────────────
export const getCampaignDashboard = async (req, res) => {
  try {
    const { id } = req.params;

    const influencers = await Influencer.find({ campaignId: id });
    const deliverables = await Deliverable.find({ campaignId: id });
    const budgets = await BudgetPerformance.find({ campaignId: id });

    const totalInfluencers = influencers.length;
    const confirmed = influencers.filter((i) => i.status === 'Confirmed').length;

    const totalEngagements = influencers.reduce((sum, i) => sum + (i.totalEngagement || 0), 0);
    const avgEngagementRate = totalInfluencers > 0
      ? parseFloat((influencers.reduce((sum, i) => sum + (i.engagementRate || 0), 0) / totalInfluencers).toFixed(2))
      : 0;

    const budgetSpent = budgets.filter((b) => b.paid === 'Yes').reduce((sum, b) => sum + b.fee, 0);
    const totalBudget = budgets.reduce((sum, b) => sum + b.fee, 0);

    // Status breakdowns
    const influencerStatuses = { Lead: 0, Contacted: 0, Confirmed: 0, Declined: 0 };
    influencers.forEach((i) => { if (influencerStatuses[i.status] !== undefined) influencerStatuses[i.status]++; });

    const deliverableStatuses = { Planned: 0, 'In Progress': 0, Submitted: 0, Approved: 0, Posted: 0 };
    deliverables.forEach((d) => { if (deliverableStatuses[d.status] !== undefined) deliverableStatuses[d.status]++; });

    const totalImpressions = budgets.reduce((sum, b) => sum + b.impressions, 0);
    const totalReach = budgets.reduce((sum, b) => sum + b.reach, 0);
    const totalConversions = budgets.reduce((sum, b) => sum + b.conversions, 0);
    const totalRevenue = budgets.reduce((sum, b) => sum + b.estimatedRevenue, 0);

    sendSuccess(res, {
      totalInfluencers,
      confirmed,
      totalEngagements,
      avgEngagementRate,
      budgetSpent,
      totalBudget,
      influencerStatuses,
      deliverableStatuses,
      totalImpressions,
      totalReach,
      totalConversions,
      totalRevenue,
    });
  } catch (err) {
    sendError(res, err.message, 500);
  }
};
