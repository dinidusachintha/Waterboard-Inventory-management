import React from 'react';
import { Package, AlertTriangle, Building2, TrendingUp } from 'lucide-react';
import { useInventoryStats } from '@/hooks/useInventory';
import DashboardStats from '@/components/reports/DashboardStats';
import StockReport from '@/components/reports/StockReport';

const Dashboard: React.FC = () => {
  const { data: stats, isLoading } = useInventoryStats();

  const statCards = [
    {
      title: 'Total Items',
      value: stats?.totalItems || 0,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Low Stock Items',
      value: stats?.lowStockItems || 0,
      icon: AlertTriangle,
      color: 'bg-yellow-500',
    },
    {
      title: 'Active Sections',
      value: stats?.activeSections || 0,
      icon: Building2,
      color: 'bg-green-500',
    },
    {
      title: 'Total Value',
      value: `₹${stats?.totalValue?.toLocaleString() || 0}`,
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
  ];

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your inventory overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-full`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StockReport />
        <DashboardStats />
      </div>
    </div>
  );
};

export default Dashboard;