import React from 'react';
import { Package, AlertTriangle, Building2, TrendingUp, Download } from 'lucide-react';
import { useInventoryStats, useInventory } from '@/hooks/useInventory';
import DashboardStats from '@/components/reports/DashboardStats';
import StockReport from '@/components/reports/StockReport';
import { generateInventoryPDF } from '@/services/pdfService';

const Dashboard: React.FC = () => {
  const { data: stats, isLoading } = useInventoryStats();
  const { data: inventory } = useInventory();

  const handleDownloadReport = () => {
    if (inventory && inventory.length > 0) {
      generateInventoryPDF(inventory);
    } else {
      alert('No inventory data to download');
    }
  };

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
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your inventory overview</p>
        </div>
        <button
          onClick={handleDownloadReport}
          className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
        >
          <Download size={18} />
          Download Full Report
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <div key={index} className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="mt-2 text-2xl font-bold">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-full`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <StockReport />
        <DashboardStats />
      </div>
    </div>
  );
};

export default Dashboard;