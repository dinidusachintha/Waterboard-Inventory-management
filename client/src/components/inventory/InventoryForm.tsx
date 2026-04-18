import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { InventoryFormData, Inventory } from '@/types/inventory.types';
import { useCreateInventory, useUpdateInventory } from '@/hooks/useInventory';
import { useSections } from '@/hooks/useSections';
import { ITEM_CATEGORIES, UNITS } from '@/utils/constants';
import toast from 'react-hot-toast';

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
  const { data: sections, isLoading: sectionsLoading } = useSections();
  const createMutation = useCreateInventory();
  const updateMutation = useUpdateInventory();

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<InventoryFormData>({
    resolver: zodResolver(inventorySchema),
    defaultValues: editingItem || {
      quantity: 0,
      minimumStock: 0,
      maximumStock: 0,
      purchaseDate: new Date().toISOString().split('T')[0],
    },
  });

  const quantity = watch('quantity');
  const minimumStock = watch('minimumStock');

  const getStockStatus = () => {
    if (quantity <= 0) return { text: 'Out of Stock', color: 'text-red-600', bg: 'bg-red-50' };
    if (quantity <= minimumStock) return { text: 'Low Stock', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { text: 'In Stock', color: 'text-green-600', bg: 'bg-green-50' };
  };

  const status = getStockStatus();

  const onSubmit = async (data: InventoryFormData) => {
    try {
      if (editingItem) {
        await updateMutation.mutateAsync({ id: editingItem._id, data });
        toast.success('Inventory item updated successfully');
      } else {
        await createMutation.mutateAsync(data);
        toast.success('Inventory item created successfully');
      }
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const generateItemCode = () => {
    const prefix = 'ITEM';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000);
    const code = `${prefix}-${timestamp}-${random}`;
    setValue('itemCode', code);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-4xl my-8 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Fill in the details below to {editingItem ? 'update' : 'create'} an inventory item
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 transition-colors hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          {/* Stock Status Indicator */}
          <div className={`${status.bg} p-4 rounded-lg mb-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Current Stock Status</p>
                <p className={`text-lg font-bold ${status.color}`}>{status.text}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Current Quantity: {quantity || 0}</p>
                <p className="text-sm text-gray-600">Minimum Stock: {minimumStock || 0}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Basic Information */}
            <div className="md:col-span-2">
              <h3 className="pb-2 mb-4 text-lg font-semibold text-gray-800 border-b">Basic Information</h3>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Item Code <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  {...register('itemCode')}
                  className="flex-1 input-field"
                  placeholder="e.g., ITEM-001"
                />
                <button
                  type="button"
                  onClick={generateItemCode}
                  className="px-3 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  title="Generate Item Code"
                >
                  Generate
                </button>
              </div>
              {errors.itemCode && (
                <p className="mt-1 text-xs text-red-500">{errors.itemCode.message}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Item Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register('itemName')}
                className="input-field"
                placeholder="Enter item name"
              />
              {errors.itemName && (
                <p className="mt-1 text-xs text-red-500">{errors.itemName.message}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>
              <select {...register('category')} className="input-field">
                <option value="">Select category</option>
                {ITEM_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Section <span className="text-red-500">*</span>
              </label>
              <select {...register('sectionId')} className="input-field" disabled={sectionsLoading}>
                <option value="">Select section</option>
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

            {/* Stock Information */}
            <div className="md:col-span-2">
              <h3 className="pb-2 mb-4 text-lg font-semibold text-gray-800 border-b">Stock Information</h3>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                {...register('quantity', { valueAsNumber: true })}
                className="input-field"
              />
              {errors.quantity && (
                <p className="mt-1 text-xs text-red-500">{errors.quantity.message}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Unit <span className="text-red-500">*</span>
              </label>
              <select {...register('unit')} className="input-field">
                <option value="">Select unit</option>
                {UNITS.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
              {errors.unit && (
                <p className="mt-1 text-xs text-red-500">{errors.unit.message}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Minimum Stock <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                {...register('minimumStock', { valueAsNumber: true })}
                className="input-field"
              />
              {errors.minimumStock && (
                <p className="mt-1 text-xs text-red-500">{errors.minimumStock.message}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Maximum Stock <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                {...register('maximumStock', { valueAsNumber: true })}
                className="input-field"
              />
              {errors.maximumStock && (
                <p className="mt-1 text-xs text-red-500">{errors.maximumStock.message}</p>
              )}
            </div>

            {/* Location & Supplier Information */}
            <div className="md:col-span-2">
              <h3 className="pb-2 mb-4 text-lg font-semibold text-gray-800 border-b">Location & Supplier</h3>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                {...register('location')}
                className="input-field"
                placeholder="e.g., Warehouse A, Shelf 2"
              />
              {errors.location && (
                <p className="mt-1 text-xs text-red-500">{errors.location.message}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Supplier <span className="text-red-500">*</span>
              </label>
              <input
                {...register('supplier')}
                className="input-field"
                placeholder="Supplier name"
              />
              {errors.supplier && (
                <p className="mt-1 text-xs text-red-500">{errors.supplier.message}</p>
              )}
            </div>

            {/* Dates */}
            <div className="md:col-span-2">
              <h3 className="pb-2 mb-4 text-lg font-semibold text-gray-800 border-b">Dates</h3>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Purchase Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register('purchaseDate')}
                className="input-field"
              />
              {errors.purchaseDate && (
                <p className="mt-1 text-xs text-red-500">{errors.purchaseDate.message}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Expiry Date
              </label>
              <input
                type="date"
                {...register('expiryDate')}
                className="input-field"
              />
            </div>

            {/* Additional Information */}
            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                {...register('notes')}
                rows={4}
                className="input-field"
                placeholder="Additional notes about this item..."
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 mt-6 border-t">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="flex items-center gap-2 btn-primary">
              <Save size={18} />
              {editingItem ? 'Update Item' : 'Create Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryForm;