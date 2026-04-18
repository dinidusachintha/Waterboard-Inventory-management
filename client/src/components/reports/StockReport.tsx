import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useInventory } from '@/hooks/useInventory';

const StockReport: React.FC = () => {
  const { data: inventoryData, isLoading } = useInventory();
  
  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Handle both array and object response formats
  const inventory = Array.isArray(inventoryData) 
    ? inventoryData 
    : inventoryData?.items || [];

  const categoryData = inventory.reduce((acc: any, item: any) => {
    const existing = acc.find((d: any) => d.category === item.category);
    if (existing) {
      existing.totalQuantity += item.quantity;
    } else {
      acc.push({ category: item.category, totalQuantity: item.quantity });
    }
    return acc;
  }, []);

  if (categoryData.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="mb-4 text-lg font-semibold">Stock by Category</h3>
        <div className="flex items-center justify-center text-gray-500 h-96">
          No inventory data available
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="mb-4 text-lg font-semibold">Stock by Category</h3>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalQuantity" fill="#3b82f6" name="Total Quantity" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockReport;