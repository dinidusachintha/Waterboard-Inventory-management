import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useInventory } from '@/hooks/useInventory';

const DashboardStats: React.FC = () => {
  const { data: inventoryData, isLoading } = useInventory();

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="animate-pulse">
          <div className="bg-gray-200 rounded h-80"></div>
        </div>
      </div>
    );
  }

  // Handle both array and object response formats
  const inventory = Array.isArray(inventoryData) 
    ? inventoryData 
    : inventoryData?.items || [];

  const statusData = [
    { name: 'In Stock', value: inventory?.filter((i: any) => i.status === 'in-stock').length || 0 },
    { name: 'Low Stock', value: inventory?.filter((i: any) => i.status === 'low-stock').length || 0 },
    { name: 'Out of Stock', value: inventory?.filter((i: any) => i.status === 'out-of-stock').length || 0 },
  ];

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  if (statusData.every(data => data.value === 0)) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="mb-4 text-lg font-semibold">Inventory Status Distribution</h3>
        <div className="flex items-center justify-center text-gray-500 h-80">
          No inventory data available
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="mb-4 text-lg font-semibold">Inventory Status Distribution</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.name}: ${entry.value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardStats;