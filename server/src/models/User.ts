import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role: 'admin' | 'manager' | 'viewer';
  department: string;
  phoneNumber: string;
  isActive: boolean;
  isEmailVerified: boolean;
  otpCode?: string;
  otpExpires?: Date;
  lastLogin?: Date;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  role: { type: String, enum: ['admin', 'manager', 'viewer'], default: 'viewer' },
  department: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  isEmailVerified: { type: Boolean, default: false },
  otpCode: { type: String },
  otpExpires: { type: Date },
  lastLogin: { type: Date },
  profilePicture: { type: String }
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);