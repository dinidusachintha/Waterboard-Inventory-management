import express from 'express';
import {
  register,
  requestOTP,
  verifyOTPAndLogin,
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
  deleteUser
} from '../controllers/authController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', authenticateToken, authorizeRoles('admin'), register);
router.post('/request-otp', requestOTP);
router.post('/verify-otp', verifyOTPAndLogin);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.post('/change-password', authenticateToken, changePassword);

// Admin only routes
router.get('/users', authenticateToken, authorizeRoles('admin'), getAllUsers);
router.put('/users/:userId/role', authenticateToken, authorizeRoles('admin'), updateUserRole);
router.put('/users/:userId/toggle-status', authenticateToken, authorizeRoles('admin'), toggleUserStatus);
router.delete('/users/:userId', authenticateToken, authorizeRoles('admin'), deleteUser);

export default router;