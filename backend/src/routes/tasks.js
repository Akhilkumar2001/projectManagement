import { Router } from 'express';
import {
  getTasksByProject,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  uploadTaskImages,
  approveTask,
  rejectTask,
} from '../controllers/taskController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.use(protect);

router.get('/project/:projectId', getTasksByProject);
router.get('/:id', getTaskById);
router.post('/', authorize('admin'), upload.array('images', 10), createTask);
router.put('/:id', authorize('admin', 'employee'), updateTask);
router.delete('/:id', authorize('admin'), deleteTask);
router.post('/:id/images', authorize('admin', 'employee'), upload.array('images', 10), uploadTaskImages);
router.put('/:id/approve', authorize('admin'), approveTask);
router.put('/:id/reject', authorize('admin'), rejectTask);

export default router;
