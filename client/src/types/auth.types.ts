export interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'admin' | 'section_manager' | 'viewer';
  sectionId?: {
    _id: string;
    name: string;
    code: string;
  };
  sectionName?: string;
  department: string;
  phoneNumber: string;
  isActive: boolean;
  profilePicture?: string;
  lastLogin?: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role?: string;
  sectionId?: string;
  department: string;
  phoneNumber: string;
}