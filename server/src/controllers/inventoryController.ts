import { Request, Response } from 'express';
import Inventory from '../models/Inventory';

// Get all inventory items with filters
export const getAllInventory = async (req: Request, res: Response) => {
  try {
    const { search, category, status, sectionId, page = 1, limit = 10 } = req.query;
    
    let query: any = {};
    
    // Apply filters
    if (search) {
      query.$or = [
        { itemName: { $regex: search, $options: 'i' } },
        { itemCode: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) query.category = category;
    if (status) query.status = status;
    if (sectionId) query.sectionId = sectionId;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const inventory = await Inventory.find(query)
      .populate('sectionId', 'name code')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });
    
    const total = await Inventory.countDocuments(query);
    
    res.json({
      items: inventory,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get inventory by ID
export const getInventoryById = async (req: Request, res: Response) => {
  try {
    const item = await Inventory.findById(req.params.id).populate('sectionId', 'name code');
    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    res.json(item);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create new inventory item
export const createInventory = async (req: Request, res: Response) => {
  try {
    const {
      itemCode,
      itemName,
      category,
      quantity,
      unit,
      minimumStock,
      maximumStock,
      location,
      sectionId,
      supplier,
      purchaseDate,
      expiryDate,
      notes
    } = req.body;
    
    // Check if item code already exists
    const existingItem = await Inventory.findOne({ itemCode });
    if (existingItem) {
      return res.status(400).json({ message: 'Item code already exists' });
    }
    
    // Determine status based on quantity
    let status = 'in-stock';
    if (quantity <= 0) {
      status = 'out-of-stock';
    } else if (quantity <= minimumStock) {
      status = 'low-stock';
    }
    
    const inventory = new Inventory({
      itemCode,
      itemName,
      category,
      quantity,
      unit,
      minimumStock,
      maximumStock,
      location,
      sectionId,
      supplier,
      purchaseDate,
      expiryDate,
      notes,
      status
    });
    
    await inventory.save();
    res.status(201).json(inventory);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update inventory item
export const updateInventory = async (req: Request, res: Response) => {
  try {
    const updateData = { ...req.body };
    
    // Recalculate status if quantity or minimumStock changed
    if (updateData.quantity !== undefined || updateData.minimumStock !== undefined) {
      const currentItem = await Inventory.findById(req.params.id);
      if (currentItem) {
        const newQuantity = updateData.quantity !== undefined ? updateData.quantity : currentItem.quantity;
        const newMinStock = updateData.minimumStock !== undefined ? updateData.minimumStock : currentItem.minimumStock;
        
        if (newQuantity <= 0) {
          updateData.status = 'out-of-stock';
        } else if (newQuantity <= newMinStock) {
          updateData.status = 'low-stock';
        } else {
          updateData.status = 'in-stock';
        }
      }
    }
    
    const inventory = await Inventory.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    
    res.json(inventory);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Delete inventory item
export const deleteInventory = async (req: Request, res: Response) => {
  try {
    const inventory = await Inventory.findByIdAndDelete(req.params.id);
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    
    res.json({ message: 'Inventory item deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get inventory statistics
export const getInventoryStats = async (req: Request, res: Response) => {
  try {
    const totalItems = await Inventory.countDocuments();
    const totalQuantity = await Inventory.aggregate([
      { $group: { _id: null, total: { $sum: '$quantity' } } }
    ]);
    
    const lowStockItems = await Inventory.countDocuments({ status: 'low-stock' });
    const outOfStockItems = await Inventory.countDocuments({ status: 'out-of-stock' });
    
    const categoriesCount = await Inventory.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    const categoriesMap: Record<string, number> = {};
    categoriesCount.forEach(item => {
      categoriesMap[item._id] = item.count;
    });
    
    res.json({
      totalItems,
      totalQuantity: totalQuantity[0]?.total || 0,
      lowStockItems,
      outOfStockItems,
      categoriesCount: categoriesMap
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get low stock items
export const getLowStockItems = async (req: Request, res: Response) => {
  try {
    const items = await Inventory.find({ status: 'low-stock' }).populate('sectionId', 'name code');
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};