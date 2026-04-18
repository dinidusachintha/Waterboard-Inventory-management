import { Request, Response } from 'express';
import Section from '../models/Section';
import Inventory from '../models/Inventory';

// Get all sections
export const getAllSections = async (req: Request, res: Response) => {
  try {
    const sections = await Section.find();
    res.json(sections);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get section by ID
export const getSectionById = async (req: Request, res: Response) => {
  try {
    const section = await Section.findById(req.params.id);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    res.json(section);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create new section
export const createSection = async (req: Request, res: Response) => {
  try {
    const { name, code, location, manager, contactNumber, email, status } = req.body;
    
    // Check if section code already exists
    const existingSection = await Section.findOne({ $or: [{ code }, { name }] });
    if (existingSection) {
      return res.status(400).json({ message: 'Section with this code or name already exists' });
    }

    const section = new Section({
      name,
      code,
      location,
      manager,
      contactNumber,
      email,
      status: status || 'active'
    });

    await section.save();
    res.status(201).json(section);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update section
export const updateSection = async (req: Request, res: Response) => {
  try {
    const section = await Section.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    
    res.json(section);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Delete section
export const deleteSection = async (req: Request, res: Response) => {
  try {
    // Check if section has inventory items
    const inventoryCount = await Inventory.countDocuments({ sectionId: req.params.id });
    if (inventoryCount > 0) {
      return res.status(400).json({ 
        message: `Cannot delete section. It has ${inventoryCount} inventory items. Move or delete them first.` 
      });
    }

    const section = await Section.findByIdAndDelete(req.params.id);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    
    res.json({ message: 'Section deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get inventory items for a section
export const getSectionInventory = async (req: Request, res: Response) => {
  try {
    const inventory = await Inventory.find({ sectionId: req.params.id });
    res.json(inventory);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};