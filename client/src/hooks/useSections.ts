import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sectionService } from '@/services/sectionService';
import { SectionFormData } from '@/types/section.types';
import toast from 'react-hot-toast';

export const useSections = () => {
  return useQuery({
    queryKey: ['sections'],
    queryFn: () => sectionService.getAll(),
  });
};

export const useSection = (id: string) => {
  return useQuery({
    queryKey: ['sections', id],
    queryFn: () => sectionService.getById(id),
    enabled: !!id,
  });
};

export const useCreateSection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: SectionFormData) => sectionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
      toast.success('Section created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create section');
    },
  });
};

export const useUpdateSection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SectionFormData> }) =>
      sectionService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
      toast.success('Section updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update section');
    },
  });
};

export const useDeleteSection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => sectionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
      toast.success('Section deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete section');
    },
  });
};

export const useSectionInventory = (sectionId: string) => {
  return useQuery({
    queryKey: ['section-inventory', sectionId],
    queryFn: () => sectionService.getSectionInventory(sectionId),
    enabled: !!sectionId,
  });
};