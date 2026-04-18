import api from './api';
import { Inventory, InventoryFormData, InventoryFilters, InventoryStats } from '@/types/inventory.types';

export const inventoryService = {
  // Get all inventory items
  getAll: async (filters?: InventoryFilters) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }
    const response = await api.get(`/inventory?${params.toString()}`);
    return response.data;
  },

  // Get single inventory item
  getById: async (id: string) => {
    const response = await api.get(`/inventory/${id}`);
    return response.data;
  },

  // Create new inventory item
  create: async (data: InventoryFormData) => {
    const response = await api.post('/inventory', data);
    return response.data;
  },

  // Update inventory item
  update: async (id: string, data: Partial<InventoryFormData>) => {
    const response = await api.put(`/inventory/${id}`, data);
    return response.data;
  },

  // Delete inventory item
  delete: async (id: string) => {
    const response = await api.delete(`/inventory/${id}`);
    return response.data;
  },

  // Get inventory stats
  getStats: async () => {
    const response = await api.get('/inventory/stats');
    return response.data;
  },

  // Get low stock items
  getLowStock: async () => {
    const response = await api.get('/inventory/low-stock');
    return response.data;
  }
};