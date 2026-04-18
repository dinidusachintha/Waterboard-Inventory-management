import { format } from 'date-fns';

export const formatDate = (date: string | Date): string => {
  if (!date) return 'N/A';
  return format(new Date(date), 'dd/MM/yyyy');
};

export const formatDateTime = (date: string | Date): string => {
  if (!date) return 'N/A';
  return format(new Date(date), 'dd/MM/yyyy HH:mm');
};

export const formatNumber = (num: number): string => {
  return num.toLocaleString('en-IN');
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

export const getStatusColor = (status: string): string => {
  const colors = {
    'in-stock': 'bg-green-100 text-green-800',
    'low-stock': 'bg-yellow-100 text-yellow-800',
    'out-of-stock': 'bg-red-100 text-red-800',
    'active': 'bg-green-100 text-green-800',
    'inactive': 'bg-gray-100 text-gray-800',
  };
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

export const getStatusText = (status: string): string => {
  const texts = {
    'in-stock': 'In Stock',
    'low-stock': 'Low Stock',
    'out-of-stock': 'Out of Stock',
    'active': 'Active',
    'inactive': 'Inactive',
  };
  return texts[status as keyof typeof texts] || status;
};