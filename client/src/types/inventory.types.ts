export interface Inventory {
  _id: string;
  itemCode: string;
  itemName: string;
  category: string;
  quantity: number;
  unit: string;
  minimumStock: number;
  maximumStock: number;
  location: string;
  sectionId: string;
  sectionName?: string;
  supplier: string;
  purchaseDate: string;
  expiryDate?: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryFormData {
  itemCode: string;
  itemName: string;
  category: string;
  quantity: number;
  unit: string;
  minimumStock: number;
  maximumStock: number;
  location: string;
  sectionId: string;
  supplier: string;
  purchaseDate: string;
  expiryDate?: string;
  notes?: string;
}

export interface InventoryFilters {
  search?: string;
  category?: string;
  status?: string;
  sectionId?: string;
  page?: number;
  limit?: number;
}

export interface InventoryStats {
  totalItems: number;
  totalQuantity: number;
  lowStockItems: number;
  outOfStockItems: number;
  categoriesCount: Record<string, number>;
}