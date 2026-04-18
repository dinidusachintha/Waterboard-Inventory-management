import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryService } from '@/services/inventoryService';
import { InventoryFormData, InventoryFilters } from '@/types/inventory.types';
import toast from 'react-hot-toast';

export const useInventory = (filters?: InventoryFilters) => {
  return useQuery({
    queryKey: ['inventory', filters],
    queryFn: async () => {
      const response = await inventoryService.getAll(filters);
      // Handle both array and paginated responses
      return response.items || response;
    },
  });
};

export const useInventoryItem = (id: string) => {
  return useQuery({
    queryKey: ['inventory', id],
    queryFn: () => inventoryService.getById(id),
    enabled: !!id,
  });
};

export const useCreateInventory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: InventoryFormData) => inventoryService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Inventory item created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create inventory item');
    },
  });
};

export const useUpdateInventory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InventoryFormData> }) =>
      inventoryService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Inventory item updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update inventory item');
    },
  });
};

export const useDeleteInventory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => inventoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Inventory item deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete inventory item');
    },
  });
};

export const useInventoryStats = () => {
  return useQuery({
    queryKey: ['inventory-stats'],
    queryFn: () => inventoryService.getStats(),
  });
};