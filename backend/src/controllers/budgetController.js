import BudgetPerformance from '../models/BudgetPerformance.js';
import { sendSuccess, sendError } from '../utils/helpers.js';

export const getBudgets = async (req, res) => {
  try {
    const budgets = await BudgetPerformance.find({ campaignId: req.params.campaignId })
      .populate('influencerId', 'name handle platform')
      .sort({ createdAt: -1 });
    sendSuccess(res, budgets);
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

export const createBudget = async (req, res) => {
  try {
    const budget = await BudgetPerformance.create({ ...req.body, campaignId: req.params.campaignId });
    const populated = await budget.populate('influencerId', 'name handle platform');
    sendSuccess(res, populated, 'Budget entry added', 201);
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

export const updateBudget = async (req, res) => {
  try {
    const budget = await BudgetPerformance.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('influencerId', 'name handle platform');
    if (!budget) return sendError(res, 'Budget entry not found', 404);
    sendSuccess(res, budget, 'Budget entry updated');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

export const deleteBudget = async (req, res) => {
  try {
    const budget = await BudgetPerformance.findByIdAndDelete(req.params.id);
    if (!budget) return sendError(res, 'Budget entry not found', 404);
    sendSuccess(res, null, 'Budget entry removed');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};
