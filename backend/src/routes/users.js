import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateProfile,
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', authorize('admin'), getAllUsers);
router.post('/', authorize('admin'), createUser);
router.put('/profile', updateProfile);
router.get('/:id', authorize('admin'), getUserById);
router.put('/:id', authorize('admin'), updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

export default router;
