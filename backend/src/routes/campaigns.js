import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getAllCampaigns, getCampaignById, createCampaign, updateCampaign, deleteCampaign,
  getCampaignDashboard,
} from '../controllers/campaignController.js';
import {
  getInfluencers, createInfluencer, updateInfluencer, deleteInfluencer,
} from '../controllers/influencerController.js';
import {
  getDeliverables, createDeliverable, updateDeliverable, deleteDeliverable,
} from '../controllers/deliverableController.js';
import {
  getBudgets, createBudget, updateBudget, deleteBudget,
} from '../controllers/budgetController.js';

const router = Router();

router.use(protect);

// Campaign CRUD
router.get('/',    authorize('admin'), getAllCampaigns);
router.get('/:id', authorize('admin'), getCampaignById);
router.post('/',   authorize('admin'), createCampaign);
router.put('/:id', authorize('admin'), updateCampaign);
router.delete('/:id', authorize('admin'), deleteCampaign);

// Dashboard
router.get('/:id/dashboard', authorize('admin'), getCampaignDashboard);

// Influencer Roster
router.get('/:campaignId/influencers',     authorize('admin'), getInfluencers);
router.post('/:campaignId/influencers',    authorize('admin'), createInfluencer);
router.put('/influencers/:id',             authorize('admin'), updateInfluencer);
router.delete('/influencers/:id',          authorize('admin'), deleteInfluencer);

// Deliverables Tracker
router.get('/:campaignId/deliverables',    authorize('admin'), getDeliverables);
router.post('/:campaignId/deliverables',   authorize('admin'), createDeliverable);
router.put('/deliverables/:id',            authorize('admin'), updateDeliverable);
router.delete('/deliverables/:id',         authorize('admin'), deleteDeliverable);

// Budget & Performance
router.get('/:campaignId/budgets',         authorize('admin'), getBudgets);
router.post('/:campaignId/budgets',        authorize('admin'), createBudget);
router.put('/budgets/:id',                 authorize('admin'), updateBudget);
router.delete('/budgets/:id',              authorize('admin'), deleteBudget);

export default router;
