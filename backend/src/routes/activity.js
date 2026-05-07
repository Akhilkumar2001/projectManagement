import { Router } from 'express';
import { getActivityLogs } from '../controllers/activityController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', authorize('admin'), getActivityLogs);

export default router;
