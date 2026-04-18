import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { InventoryFormData, Inventory } from '@/types/inventory.types';
import { useCreateInventory, useUpdateInventory } from '@/hooks/useInventory';
import { useSections } from '@/hooks/useSections';
import { ITEM_CATEGORIES, UNITS } from '@/utils/constants';

const inventorySchema = z.object({
  itemCode: z.string().min(1, 'Item code is required'),
  itemName: z.string().min(1, 'Item name is required'),
  category: z.string().min(1, 'Category is required'),
  quantity: z.number().min(0, 'Quantity must be 0 or greater'),
  unit: z.string().min(1, 'Unit is required'),
  minimumStock: z.number().min(0, 'Minimum stock must be 0 or greater'),
  maximumStock: z.number().min(0, 'Maximum stock must be 0 or greater'),
  location: z.string().min(1, 'Location is required'),
  sectionId: z.string().min(1, 'Section is required'),
  supplier: z.string().min(1, 'Supplier is required'),
  purchaseDate: z.string().min(1, 'Purchase date is required'),
  expiryDate: z.string().optional(),
  notes: z.string().optional(),
});

interface InventoryFormProps {
  onClose: () => void;
  editingItem?: Inventory | null;
}

const InventoryForm: React.FC<InventoryFormProps> = ({ onClose, editingItem }) => {
  const { data: sections } = useSections();
  const createMutation = useCreateInventory();
  const updateMutation = useUpdateInventory();

  const { register, handleSubmit, formState: { errors } } = useForm<InventoryFormData>({
    resolver: zodResolver(inventorySchema),
    defaultValues: editingItem || {
      quantity: 0,
      minimumStock: 0,
      maximumStock: 0,
    },
  });

  const onSubmit = async (data: InventoryFormData) => {
    if (editingItem) {
      await updateMutation.mutateAsync({ id: editingItem._id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Code *
              </label>
              <input
                {...register('itemCode')}
                className="input-field"
                placeholder="e.g., ITEM-001"
              />
              {errors.itemCode && (
                <p className="text-red-500 text-xs mt-1">{errors.itemCode.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Name *
              </label>
              <input
                {...register('itemName')}
                className="input-field"
                placeholder="Enter item name"
              />
              {errors.itemName && (
                <p className="text-red-500 text-xs mt-1">{errors.itemName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select {...register('category')} className="input-field">
                <option value="">Select category</option>
                {ITEM_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Section *
              </label>
              <select {...register('sectionId')} className="input-field">
                <option value="">Select section</option>
                {sections?.map((section: any) => (
                  <option key={section._id} value={section._id}>
                    {section.name} ({section.code})
                  </option>
                ))}
              </select>
              {errors.sectionId && (
                <p className="text-red-500 text-xs mt-1">{errors.sectionId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity *
              </label>
              <input
                type="number"
                {...register('quantity', { valueAsNumber: true })}
                className="input-field"
              />
              {errors.quantity && (
                <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit *
              </label>
              <select {...register('unit')} className="input-field">
                <option value="">Select unit</option>
                {UNITS.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
              {errors.unit && (
                <p className="text-red-500 text-xs mt-1">{errors.unit.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Stock *
              </label>
              <input
                type="number"
                {...register('minimumStock', { valueAsNumber: true })}
                className="input-field"
              />
              {errors.minimumStock && (
                <p className="text-red-500 text-xs mt-1">{errors.minimumStock.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Stock *
              </label>
              <input
                type="number"
                {...register('maximumStock', { valueAsNumber: true })}
                className="input-field"
              />
              {errors.maximumStock && (
                <p className="text-red-500 text-xs mt-1">{errors.maximumStock.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                {...register('location')}
                className="input-field"
                placeholder="Storage location"
              />
              {errors.location && (
                <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supplier *
              </label>
              <input
                {...register('supplier')}
                className="input-field"
                placeholder="Supplier name"
              />
              {errors.supplier && (
                <p className="text-red-500 text-xs mt-1">{errors.supplier.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purchase Date *
              </label>
              <input
                type="date"
                {...register('purchaseDate')}
                className="input-field"
              />
              {errors.purchaseDate && (
                <p className="text-red-500 text-xs mt-1">{errors.purchaseDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                {...register('expiryDate')}
                className="input-field"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="input-field"
                placeholder="Additional notes..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingItem ? 'Update' : 'Create'} Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryForm;