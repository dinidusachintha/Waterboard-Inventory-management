import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User';
import { sendOTPEmail, sendWelcomeEmail } from '../services/emailService';

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate JWT Token
const generateToken = (userId: string, email: string, role: string) => {
  return jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '7d' }
  );
};

// Register new user (Admin only)
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, fullName, role, department, phoneNumber } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email or username' });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      fullName,
      role: role || 'viewer',
      department,
      phoneNumber,
      isActive: true,
      isEmailVerified: false
    });

    await user.save();

    // Send welcome email
    await sendWelcomeEmail(email, fullName);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Request OTP for login
export const requestOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated. Contact administrator.' });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otpCode = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP email
    await sendOTPEmail(email, otp, user.fullName);

    res.json({ message: 'OTP sent to your email address' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Verify OTP and login
export const verifyOTPAndLogin = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check OTP
    if (!user.otpCode || user.otpCode !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Check OTP expiry
    if (user.otpExpires && user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // Update last login
    user.lastLogin = new Date();
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate token
    const token = generateToken(user._id.toString(), user.email, user.role);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        department: user.department,
        phoneNumber: user.phoneNumber,
        profilePicture: user.profilePicture
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get current user profile
export const getProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.userId).select('-password -otpCode -otpExpires');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
export const updateProfile = async (req: any, res: Response) => {
  try {
    const { fullName, phoneNumber, department, profilePicture } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { fullName, phoneNumber, department, profilePicture },
      { new: true }
    ).select('-password -otpCode -otpExpires');

    res.json({ message: 'Profile updated successfully', user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Change password
export const changePassword = async (req: any, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users (Admin only)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password -otpCode -otpExpires');
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update user role (Admin only)
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password -otpCode -otpExpires');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User role updated successfully', user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle user status (Admin only)
export const toggleUserStatus = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully` });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user (Admin only)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    await User.findByIdAndDelete(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};