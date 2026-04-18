import React, { useState } from 'react';
import { Search, Edit, Trash2, Eye, Filter, Download, FileText } from 'lucide-react';
import { Inventory } from '@/types/inventory.types';
import { formatDate, formatNumber, getStatusColor, getStatusText } from '@/utils/formatters';
import { generateInventoryPDF, generateSingleItemPDF } from '@/services/pdfService';

interface InventoryListProps {
  inventory: Inventory[];
  onEdit: (item: Inventory) => void;
  onDelete: (id: string) => void;
  onView: (item: Inventory) => void;
}

const InventoryList: React.FC<InventoryListProps> = ({ 
  inventory = [], 
  onEdit, 
  onDelete, 
  onView 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = ['all', ...new Set(inventory.map(item => item.category))];

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.itemCode?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleDownloadAll = () => {
    if (filteredInventory.length === 0) {
      alert('No items to download');
      return;
    }
    generateInventoryPDF(filteredInventory);
  };

  const handleDownloadSingle = (item: Inventory) => {
    generateSingleItemPDF(item);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Inventory Items</h2>
          <button
            onClick={handleDownloadAll}
            className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
          >
            <Download size={18} />
            Download All as PDF
          </button>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by item name or code..."
              className="w-full py-2 pl-10 pr-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>

          <select
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        {filteredInventory.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No inventory items found
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Item Code</th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Item Name</th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Section</th>
                <th className="px-6 py-3 text-xs font-medium text-right text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.itemCode}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.itemName}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatNumber(item.quantity)} {item.unit}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                      {getStatusText(item.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.sectionName || item.sectionId}</td>
                  <td className="px-6 py-4 space-x-2 text-right">
                    <button 
                      onClick={() => handleDownloadSingle(item)} 
                      className="text-green-600 hover:text-green-900"
                      title="Download PDF"
                    >
                      <FileText size={18} />
                    </button>
                    <button onClick={() => onView(item)} className="text-blue-600 hover:text-blue-900" title="View Details">
                      <Eye size={18} />
                    </button>
                    <button onClick={() => onEdit(item)} className="text-yellow-600 hover:text-yellow-900" title="Edit">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => onDelete(item._id)} className="text-red-600 hover:text-red-900" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      <div className="p-4 border-t bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            Showing {filteredInventory.length} of {inventory.length} items
          </div>
          <div>
            Total Quantity: {inventory.reduce((sum, item) => sum + item.quantity, 0)} units
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryList;