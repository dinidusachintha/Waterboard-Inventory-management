import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import InventoryList from '@/components/inventory/InventoryList';
import InventoryForm from '@/components/inventory/InventoryForm';
import InventoryDetails from '@/components/inventory/InventoryDetails';
import { useInventory, useDeleteInventory } from '@/hooks/useInventory';
import { Inventory } from '@/types/inventory.types';

const InventoryPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Inventory | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Inventory | null>(null);
  
  const { data: inventory, isLoading, refetch } = useInventory();
  const deleteMutation = useDeleteInventory();

  const handleEdit = (item: Inventory) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await deleteMutation.mutateAsync(id);
      refetch();
    }
  };

  const handleView = (item: Inventory) => {
    setSelectedItem(item);
    setIsDetailsOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingItem(null);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
          <p className="text-gray-600">Manage all inventory items across sections</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} /> Add New Item
        </button>
      </div>

      <InventoryList
        inventory={inventory || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      {isFormOpen && (
        <InventoryForm
          onClose={handleFormClose}
          editingItem={editingItem}
        />
      )}

      {isDetailsOpen && selectedItem && (
        <InventoryDetails
          item={selectedItem}
          onClose={() => setIsDetailsOpen(false)}
        />
      )}
    </div>
  );
};

export default InventoryPage;