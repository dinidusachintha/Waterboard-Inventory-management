import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/waterboard_inventory');
    
    const adminExists = await User.findOne({ email: 'admin@waterboard.com' });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      
      const admin = new User({
        username: 'admin',
        email: 'admin@waterboard.com',
        password: hashedPassword,
        fullName: 'System Administrator',
        role: 'admin',
        department: 'IT Administration',
        phoneNumber: '+1234567890',
        isActive: true,
        isEmailVerified: true
      });
      
      await admin.save();
      console.log('✅ Admin user created successfully!');
      console.log('Email: admin@waterboard.com');
      console.log('Password: Admin@123');
    } else {
      console.log('⚠️ Admin user already exists');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();