import api from './api';
import { Section, SectionFormData } from '@/types/section.types';

export const sectionService = {
  // Get all sections
  getAll: async () => {
    const response = await api.get('/sections');
    return response.data;
  },

  // Get single section
  getById: async (id: string) => {
    const response = await api.get(`/sections/${id}`);
    return response.data;
  },

  // Create new section
  create: async (data: SectionFormData) => {
    const response = await api.post('/sections', data);
    return response.data;
  },

  // Update section
  update: async (id: string, data: Partial<SectionFormData>) => {
    const response = await api.put(`/sections/${id}`, data);
    return response.data;
  },

  // Delete section
  delete: async (id: string) => {
    const response = await api.delete(`/sections/${id}`);
    return response.data;
  },

  // Get section inventory
  getSectionInventory: async (id: string) => {
    const response = await api.get(`/sections/${id}/inventory`);
    return response.data;
  }
};