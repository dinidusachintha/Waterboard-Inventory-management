import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useInventory } from '@/hooks/useInventory';

const StockReport: React.FC = () => {
  const { data: inventory } = useInventory();

  const categoryData = inventory?.reduce((acc: any, item: any) => {
    const existing = acc.find((d: any) => d.category === item.category);
    if (existing) {
      existing.totalQuantity += item.quantity;
    } else {
      acc.push({ category: item.category, totalQuantity: item.quantity });
    }
    return acc;
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Stock by Category</h3>
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