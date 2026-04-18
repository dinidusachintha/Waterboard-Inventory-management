export const ITEM_CATEGORIES = [
  'Pipes & Fittings',
  'Valves',
  'Pumps',
  'Meters',
  'Chemicals',
  'Tools & Equipment',
  'Safety Equipment',
  'Office Supplies',
  'Maintenance Parts',
  'Other'
];

export const UNITS = [
  'Pieces',
  'Kg',
  'Liters',
  'Meters',
  'Box',
  'Set',
  'Roll',
  'Packet',
  'Unit'
];

export const STOCK_STATUS = {
  IN_STOCK: 'in-stock',
  LOW_STOCK: 'low-stock',
  OUT_OF_STOCK: 'out-of-stock'
} as const;

export const SECTION_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive'
} as const;

export const API_ENDPOINTS = {
  INVENTORY: '/api/inventory',
  SECTIONS: '/api/sections',
  REPORTS: '/api/reports',
  DASHBOARD: '/api/dashboard'
} as const;