import React from 'react';
import { X, Package, MapPin, Calendar, Truck, AlertCircle } from 'lucide-react';
import { Inventory } from '@/types/inventory.types';
import { formatDate, formatNumber, getStatusColor, getStatusText } from '@/utils/formatters';

interface InventoryDetailsProps {
  item: Inventory;
  onClose: () => void;
}

const InventoryDetails: React.FC<InventoryDetailsProps> = ({ item, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Inventory Item Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Item Code</label>
              <p className="font-medium">{item.itemCode}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Item Name</label>
              <p className="font-medium">{item.itemName}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Category</label>
              <p>{item.category}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Status</label>
              <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                {getStatusText(item.status)}
              </span>
            </div>
            <div>
              <label className="text-sm text-gray-500">Quantity</label>
              <p>{formatNumber(item.quantity)} {item.unit}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Stock Levels</label>
              <p>Min: {item.minimumStock} | Max: {item.maximumStock}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Location</label>
              <p>{item.location}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Supplier</label>
              <p>{item.supplier}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Purchase Date</label>
              <p>{formatDate(item.purchaseDate)}</p>
            </div>
            {item.expiryDate && (
              <div>
                <label className="text-sm text-gray-500">Expiry Date</label>
                <p>{formatDate(item.expiryDate)}</p>
              </div>
            )}
          </div>

          {item.notes && (
            <div>
              <label className="text-sm text-gray-500">Notes</label>
              <p className="mt-1 text-gray-700">{item.notes}</p>
            </div>
          )}

          {item.status === 'low-stock' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="text-yellow-600 mt-0.5" size={20} />
              <div>
                <p className="text-sm font-medium text-yellow-800">Low Stock Alert</p>
                <p className="text-sm text-yellow-700">
                  Current stock is below minimum threshold. Please reorder soon.
                </p>
              </div>
            </div>
          )}

          {item.status === 'out-of-stock' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="text-red-600 mt-0.5" size={20} />
              <div>
                <p className="text-sm font-medium text-red-800">Out of Stock</p>
                <p className="text-sm text-red-700">
                  Item is currently out of stock. Immediate action required.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryDetails;