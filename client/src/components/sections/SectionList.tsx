import React from 'react';
import { Edit, Trash2, MapPin, Phone, Mail } from 'lucide-react';
import { Section } from '@/types/section.types';
import { getStatusColor, getStatusText } from '@/utils/formatters';

interface SectionListProps {
  sections: Section[];
  onEdit: (section: Section) => void;
  onDelete: (id: string) => void;
}

const SectionList: React.FC<SectionListProps> = ({ sections, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sections.map((section) => (
        <div key={section._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{section.name}</h3>
                <p className="text-sm text-gray-500">Code: {section.code}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(section.status)}`}>
                {getStatusText(section.status)}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={16} />
                <span>{section.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={16} />
                <span>{section.contactNumber}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail size={16} />
                <span>{section.email}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <button
                onClick={() => onEdit(section)}
                className="px-3 py-1 text-sm bg-green-50 text-green-600 rounded hover:bg-green-100"
              >
                <Edit size={16} className="inline mr-1" /> Edit
              </button>
              <button
                onClick={() => onDelete(section._id)}
                className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100"
              >
                <Trash2 size={16} className="inline mr-1" /> Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SectionList;