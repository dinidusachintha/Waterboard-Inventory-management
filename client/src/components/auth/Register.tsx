import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus, Mail, Lock, User, Phone, Building, X } from 'lucide-react';
import api from '@/services/api';
import { useSections } from '@/hooks/useSections';
import toast from 'react-hot-toast';

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Full name is required'),
  role: z.enum(['section_manager', 'viewer']),
  sectionId: z.string().optional(),
  department: z.string().min(2, 'Department is required'),
  phoneNumber: z.string().min(10, 'Valid phone number is required'),
});

interface RegisterProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const Register: React.FC<RegisterProps> = ({ onClose, onSuccess }) => {
  const { data: sections } = useSections();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'viewer'
    }
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await api.post('/auth/register', data);
      toast.success('User registered successfully!');
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between p-6 bg-white border-b">
          <div>
            <h2 className="text-xl font-semibold">Register New User</h2>
            <p className="text-sm text-gray-500">Create a new user account</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 text-gray-400" size={20} />
              <input
                {...register('fullName')}
                className="w-full py-2 pl-10 pr-4 border rounded-lg"
                placeholder="John Doe"
              />
            </div>
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Username *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 text-gray-400" size={20} />
              <input
                {...register('username')}
                className="w-full py-2 pl-10 pr-4 border rounded-lg"
                placeholder="john_doe"
              />
            </div>
            {errors.username && (
              <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-gray-400" size={20} />
              <input
                type="email"
                {...register('email')}
                className="w-full py-2 pl-10 pr-4 border rounded-lg"
                placeholder="john@waterboard.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-gray-400" size={20} />
              <input
                type="password"
                {...register('password')}
                className="w-full py-2 pl-10 pr-4 border rounded-lg"
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Role *
            </label>
            <select {...register('role')} className="w-full px-4 py-2 border rounded-lg">
              <option value="viewer">Viewer (Read Only)</option>
              <option value="section_manager">Section Manager (Can manage inventory)</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>
            )}
          </div>

          {(selectedRole === 'section_manager' || selectedRole === 'viewer') && (
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Assign Section *
              </label>
              <select {...register('sectionId')} className="w-full px-4 py-2 border rounded-lg">
                <option value="">Select a section</option>
                {sections?.map((section: any) => (
                  <option key={section._id} value={section._id}>
                    {section.name} ({section.code})
                  </option>
                ))}
              </select>
              {errors.sectionId && (
                <p className="mt-1 text-xs text-red-500">{errors.sectionId.message}</p>
              )}
            </div>
          )}

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Department *
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-2.5 text-gray-400" size={20} />
              <input
                {...register('department')}
                className="w-full py-2 pl-10 pr-4 border rounded-lg"
                placeholder="Water Supply Department"
              />
            </div>
            {errors.department && (
              <p className="mt-1 text-xs text-red-500">{errors.department.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 text-gray-400" size={20} />
              <input
                {...register('phoneNumber')}
                className="w-full py-2 pl-10 pr-4 border rounded-lg"
                placeholder="+1234567890"
              />
            </div>
            {errors.phoneNumber && (
              <p className="mt-1 text-xs text-red-500">{errors.phoneNumber.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Registering...' : 'Register User'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;