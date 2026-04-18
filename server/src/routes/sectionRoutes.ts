import express from 'express';
import {
  getAllSections,
  getSectionById,
  createSection,
  updateSection,
  deleteSection,
  getSectionInventory
} from '../controllers/sectionController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.get('/', authenticateToken, getAllSections);
router.get('/:id', authenticateToken, getSectionById);
router.get('/:id/inventory', authenticateToken, getSectionInventory);

// Admin and manager can create/update sections
router.post('/', authenticateToken, authorizeRoles('admin', 'manager'), createSection);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'manager'), updateSection);

// Only admin can delete sections
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteSection);

export default router;