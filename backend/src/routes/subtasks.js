import { Router } from 'express';
import {
  getSubtasksByTask,
  updateSubtask,
  uploadSubtaskImages,
} from '../controllers/subtaskController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.use(protect);

router.get('/task/:taskId', getSubtasksByTask);
router.put('/:id', authorize('admin', 'employee'), updateSubtask);
router.post('/:id/images', authorize('admin', 'employee'), upload.array('images', 10), uploadSubtaskImages);

export default router;
