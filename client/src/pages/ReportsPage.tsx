import React from 'react';
import { FileText, Download } from 'lucide-react';
import StockReport from '@/components/reports/StockReport';
import DashboardStats from '@/components/reports/DashboardStats';

const ReportsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-gray-600">View inventory reports and analytics</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Download size={20} /> Export Reports
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <DashboardStats />
        <StockReport />
      </div>
    </div>
  );
};

export default ReportsPage;