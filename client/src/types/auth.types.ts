export interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'admin' | 'manager' | 'viewer';
  department: string;
  phoneNumber: string;
  isActive: boolean;
  profilePicture?: string;
  lastLogin?: string;
}

export interface LoginRequest {
  email: string;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role?: string;
  department: string;
  phoneNumber: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  message: string;
  token?: string;
  user?: User;
}