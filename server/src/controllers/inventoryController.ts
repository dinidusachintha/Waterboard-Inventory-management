import { Request, Response } from 'express';
import Inventory from '../models/Inventory';

// Get inventory based on user role and section
export const getAllInventory = async (req: any, res: Response) => {
  try {
    const { search, category, status, page = 1, limit = 10 } = req.query;
    const userRole = req.user.role;
    const userSectionId = req.user.sectionId;
    
    let query: any = {};
    
    // Filter by section for non-admin users
    if (userRole !== 'admin') {
      if (!userSectionId) {
        return res.status(403).json({ message: 'No section assigned to this user' });
      }
      query.sectionId = userSectionId;
    } else if (req.query.sectionId) {
      // Admin can filter by section
      query.sectionId = req.query.sectionId;
    }
    
    // Apply search filters
    if (search) {
      query.$or = [
        { itemName: { $regex: search, $options: 'i' } },
        { itemCode: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) query.category = category;
    if (status) query.status = status;
    
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
    console.error('Get inventory error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create inventory item
export const createInventory = async (req: any, res: Response) => {
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
    
    // Check if user has permission to add to this section
    if (req.user.role !== 'admin' && req.user.sectionId !== sectionId) {
      return res.status(403).json({ message: 'You can only add items to your assigned section' });
    }
    
    // Check if item code already exists in the section
    const existingItem = await Inventory.findOne({ itemCode, sectionId });
    if (existingItem) {
      return res.status(400).json({ message: 'Item code already exists in this section' });
    }
    
    // Determine status
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
    console.error('Create inventory error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update inventory item
export const updateInventory = async (req: any, res: Response) => {
  try {
    const inventory = await Inventory.findById(req.params.id);
    
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    
    // Check permission
    if (req.user.role !== 'admin' && req.user.sectionId !== inventory.sectionId.toString()) {
      return res.status(403).json({ message: 'You can only update items in your assigned section' });
    }
    
    const updateData = { ...req.body };
    
    // Recalculate status
    if (updateData.quantity !== undefined || updateData.minimumStock !== undefined) {
      const newQuantity = updateData.quantity !== undefined ? updateData.quantity : inventory.quantity;
      const newMinStock = updateData.minimumStock !== undefined ? updateData.minimumStock : inventory.minimumStock;
      
      if (newQuantity <= 0) {
        updateData.status = 'out-of-stock';
      } else if (newQuantity <= newMinStock) {
        updateData.status = 'low-stock';
      } else {
        updateData.status = 'in-stock';
      }
    }
    
    const updatedInventory = await Inventory.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.json(updatedInventory);
  } catch (error: any) {
    console.error('Update inventory error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete inventory item
export const deleteInventory = async (req: any, res: Response) => {
  try {
    const inventory = await Inventory.findById(req.params.id);
    
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    
    // Check permission (only admin or section manager can delete)
    if (req.user.role !== 'admin' && req.user.role !== 'section_manager') {
      return res.status(403).json({ message: 'You do not have permission to delete items' });
    }
    
    if (req.user.role !== 'admin' && req.user.sectionId !== inventory.sectionId.toString()) {
      return res.status(403).json({ message: 'You can only delete items in your assigned section' });
    }
    
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Inventory item deleted successfully' });
  } catch (error: any) {
    console.error('Delete inventory error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get inventory stats
export const getInventoryStats = async (req: any, res: Response) => {
  try {
    let query = {};
    
    if (req.user.role !== 'admin') {
      query = { sectionId: req.user.sectionId };
    } else if (req.query.sectionId) {
      query = { sectionId: req.query.sectionId };
    }
    
    const totalItems = await Inventory.countDocuments(query);
    const totalQuantity = await Inventory.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$quantity' } } }
    ]);
    
    const lowStockItems = await Inventory.countDocuments({ ...query, status: 'low-stock' });
    const outOfStockItems = await Inventory.countDocuments({ ...query, status: 'out-of-stock' });
    
    const categoriesCount = await Inventory.aggregate([
      { $match: query },
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
    console.error('Get stats error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get low stock items
export const getLowStockItems = async (req: any, res: Response) => {
  try {
    let query: any = { status: 'low-stock' };
    
    if (req.user.role !== 'admin') {
      query.sectionId = req.user.sectionId;
    }
    
    const items = await Inventory.find(query).populate('sectionId', 'name code');
    res.json(items);
  } catch (error: any) {
    console.error('Get low stock error:', error);
    res.status(500).json({ message: error.message });
  }
};