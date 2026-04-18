import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import SectionList from '@/components/sections/SectionList';
import SectionForm from '@/components/sections/SectionForm';
import { useSections, useDeleteSection } from '@/hooks/useSections';
import { Section } from '@/types/section.types';

const SectionsPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const { data: sections, isLoading, refetch } = useSections();
  const deleteMutation = useDeleteSection();

  const handleEdit = (section: Section) => {
    setEditingSection(section);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      await deleteMutation.mutateAsync(id);
      refetch();
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingSection(null);
    refetch();
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Sections Management</h1>
          <p className="text-gray-600">Manage all waterboard sections and departments</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} /> Add New Section
        </button>
      </div>

      <SectionList
        sections={sections || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isFormOpen && (
        <SectionForm
          onClose={handleFormClose}
          editingSection={editingSection}
        />
      )}
    </div>
  );
};

export default SectionsPage;