import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { SectionFormData, Section } from '@/types/section.types';
import { useCreateSection, useUpdateSection } from '@/hooks/useSections';

const sectionSchema = z.object({
  name: z.string().min(1, 'Section name is required'),
  code: z.string().min(1, 'Section code is required'),
  location: z.string().min(1, 'Location is required'),
  manager: z.string().min(1, 'Manager name is required'),
  contactNumber: z.string().min(1, 'Contact number is required'),
  email: z.string().email('Invalid email address'),
  status: z.enum(['active', 'inactive']),
});

interface SectionFormProps {
  onClose: () => void;
  editingSection?: Section | null;
}

const SectionForm: React.FC<SectionFormProps> = ({ onClose, editingSection }) => {
  const createMutation = useCreateSection();
  const updateMutation = useUpdateSection();

  const { register, handleSubmit, formState: { errors } } = useForm<SectionFormData>({
    resolver: zodResolver(sectionSchema),
    defaultValues: editingSection || {
      status: 'active',
    },
  });

  const onSubmit = async (data: SectionFormData) => {
    if (editingSection) {
      await updateMutation.mutateAsync({ id: editingSection._id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {editingSection ? 'Edit Section' : 'Add New Section'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section Name *
            </label>
            <input {...register('name')} className="input-field" />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section Code *
            </label>
            <input {...register('code')} className="input-field" />
            {errors.code && (
              <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <input {...register('location')} className="input-field" />
            {errors.location && (
              <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Manager Name *
            </label>
            <input {...register('manager')} className="input-field" />
            {errors.manager && (
              <p className="text-red-500 text-xs mt-1">{errors.manager.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Number *
            </label>
            <input {...register('contactNumber')} className="input-field" />
            {errors.contactNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.contactNumber.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input type="email" {...register('email')} className="input-field" />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select {...register('status')} className="input-field">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingSection ? 'Update' : 'Create'} Section
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SectionForm;