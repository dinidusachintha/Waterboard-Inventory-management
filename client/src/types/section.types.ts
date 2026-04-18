export interface Section {
  _id: string;
  name: string;
  code: string;
  location: string;
  manager: string;
  contactNumber: string;
  email: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface SectionFormData {
  name: string;
  code: string;
  location: string;
  manager: string;
  contactNumber: string;
  email: string;
  status: 'active' | 'inactive';
}