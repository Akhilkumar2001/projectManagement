import { Router } from 'express';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.post('/', authorize('admin'), createProject);
router.put('/:id', authorize('admin'), updateProject);
router.delete('/:id', authorize('admin'), deleteProject);

export default router;
