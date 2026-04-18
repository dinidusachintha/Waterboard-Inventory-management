import express from 'express';
import {
  getAllInventory,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory,
  getInventoryStats,
  getLowStockItems
} from '../controllers/inventoryController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.get('/', authenticateToken, getAllInventory);
router.get('/stats', authenticateToken, getInventoryStats);
router.get('/low-stock', authenticateToken, getLowStockItems);
router.get('/:id', authenticateToken, getInventoryById);

// Admin and manager can create/update
router.post('/', authenticateToken, authorizeRoles('admin', 'manager'), createInventory);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'manager'), updateInventory);

// Only admin can delete
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteInventory);

export default router;