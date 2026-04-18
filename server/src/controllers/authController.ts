import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Section from '../models/Section';

// Generate JWT Token
const generateToken = (userId: string, email: string, role: string, sectionId?: string) => {
  return jwt.sign(
    { userId, email, role, sectionId },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '7d' }
  );
};

// Register new user (Admin only)
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, fullName, role, sectionId, department, phoneNumber } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email or username' });
    }

    // If role is section_manager or viewer, validate sectionId
    if ((role === 'section_manager' || role === 'viewer') && !sectionId) {
      return res.status(400).json({ message: 'Section is required for this role' });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      fullName,
      role: role || 'viewer',
      sectionId: sectionId || null,
      department,
      phoneNumber,
      isActive: true,
      isEmailVerified: true
    });

    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        sectionId: user.sectionId,
        department: user.department,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Login with password
export const loginWithPassword = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate('sectionId', 'name code');
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated. Contact administrator.' });
    }

    // Check password
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id.toString(), user.email, user.role, user.sectionId?._id?.toString());

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        sectionId: user.sectionId,
        sectionName: user.sectionId?.name,
        department: user.department,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Request OTP
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

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.otpCode = otp;
    user.otpExpires = otpExpires;
    await user.save();

    console.log(`=================================`);
    console.log(`🔐 OTP for ${email}: ${otp}`);
    console.log(`=================================`);

    res.json({ message: 'OTP sent successfully', dev_otp: otp });
  } catch (error: any) {
    console.error('Request OTP error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Verify OTP and login
export const verifyOTPAndLogin = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email }).populate('sectionId', 'name code');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.otpCode || user.otpCode !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.otpExpires && user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    user.lastLogin = new Date();
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = generateToken(user._id.toString(), user.email, user.role, user.sectionId?._id?.toString());

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        sectionId: user.sectionId,
        sectionName: user.sectionId?.name,
        department: user.department,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get current user profile
export const getProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password -otpCode -otpExpires')
      .populate('sectionId', 'name code');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all users (Admin only)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find()
      .select('-password -otpCode -otpExpires')
      .populate('sectionId', 'name code');
    res.json(users);
  } catch (error: any) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get users by section (Admin only)
export const getUsersBySection = async (req: Request, res: Response) => {
  try {
    const { sectionId } = req.params;
    const users = await User.find({ sectionId })
      .select('-password -otpCode -otpExpires')
      .populate('sectionId', 'name code');
    res.json(users);
  } catch (error: any) {
    console.error('Get users by section error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update user role (Admin only)
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { role, sectionId } = req.body;

    const updateData: any = { role };
    if (sectionId) updateData.sectionId = sectionId;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-password -otpCode -otpExpires').populate('sectionId', 'name code');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user });
  } catch (error: any) {
    console.error('Update user error:', error);
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
    console.error('Delete user error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update profile
export const updateProfile = async (req: any, res: Response) => {
  try {
    const { fullName, phoneNumber, department, profilePicture } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { fullName, phoneNumber, department, profilePicture },
      { new: true }
    ).select('-password -otpCode -otpExpires').populate('sectionId', 'name code');

    res.json({ message: 'Profile updated successfully', user });
  } catch (error: any) {
    console.error('Update profile error:', error);
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

    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error: any) {
    console.error('Change password error:', error);
    res.status(500).json({ message: error.message });
  }
};