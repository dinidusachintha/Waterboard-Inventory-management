import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Phone, Building, Key, Save, Edit2 } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phoneNumber: user?.phoneNumber || '',
    department: user?.department || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(formData);
    setIsEditing(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    await changePassword(passwordData.currentPassword, passwordData.newPassword);
    setShowPasswordChange(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <Edit2 size={18} /> Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full py-2 pl-10 pr-4 border rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 text-gray-400" size={20} />
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full py-2 pl-10 pr-4 border rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Department
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-2.5 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full py-2 pl-10 pr-4 border rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700">
                  <Save size={18} /> Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{user?.fullName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium">{user?.phoneNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium">{user?.department}</p>
                </div>
              </div>
              <div className="pt-4">
                <button
                  onClick={() => setShowPasswordChange(!showPasswordChange)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <Key size={18} /> Change Password
                </button>
              </div>
            </div>
          )}

          {showPasswordChange && (
            <form onSubmit={handleChangePassword} className="pt-6 mt-6 border-t">
              <h3 className="mb-4 text-lg font-semibold">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                    Update Password
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPasswordChange(false)}
                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;