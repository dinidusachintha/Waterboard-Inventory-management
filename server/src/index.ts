import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock data for testing
const mockInventory = [
  {
    _id: '1',
    itemCode: 'ITEM-001',
    itemName: 'PVC Pipe 4 inch',
    category: 'Pipes & Fittings',
    quantity: 150,
    unit: 'Pieces',
    minimumStock: 50,
    maximumStock: 500,
    location: 'Warehouse A',
    sectionId: '1',
    sectionName: 'Water Supply Section',
    supplier: 'ABC Suppliers',
    purchaseDate: '2024-01-15',
    status: 'in-stock',
    notes: 'High quality PVC pipes',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    _id: '2',
    itemCode: 'ITEM-002',
    itemName: 'Brass Valve 2 inch',
    category: 'Valves',
    quantity: 25,
    unit: 'Pieces',
    minimumStock: 30,
    maximumStock: 100,
    location: 'Warehouse B',
    sectionId: '2',
    sectionName: 'Maintenance Section',
    supplier: 'ValveCorp',
    purchaseDate: '2024-01-20',
    status: 'low-stock',
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  },
  {
    _id: '3',
    itemCode: 'ITEM-003',
    itemName: 'Submersible Pump 5HP',
    category: 'Pumps',
    quantity: 0,
    unit: 'Pieces',
    minimumStock: 5,
    maximumStock: 20,
    location: 'Warehouse A',
    sectionId: '1',
    sectionName: 'Water Supply Section',
    supplier: 'PumpTech',
    purchaseDate: '2024-01-10',
    status: 'out-of-stock',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  }
];

const mockSections = [
  {
    _id: '1',
    name: 'Water Supply Section',
    code: 'WSS-001',
    location: 'Main Building, Floor 2',
    manager: 'John Doe',
    contactNumber: '+1234567890',
    email: 'john.doe@waterboard.com',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: '2',
    name: 'Maintenance Section',
    code: 'MS-002',
    location: 'Service Center',
    manager: 'Jane Smith',
    contactNumber: '+1234567891',
    email: 'jane.smith@waterboard.com',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: '3',
    name: 'Quality Control',
    code: 'QC-003',
    location: 'Lab Building',
    manager: 'Robert Johnson',
    contactNumber: '+1234567892',
    email: 'robert.johnson@waterboard.com',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Routes
app.get('/api/inventory', (req, res) => {
  res.json(mockInventory);
});

app.get('/api/inventory/stats', (req, res) => {
  const stats = {
    totalItems: mockInventory.length,
    totalQuantity: mockInventory.reduce((sum, item) => sum + item.quantity, 0),
    lowStockItems: mockInventory.filter(item => item.status === 'low-stock').length,
    outOfStockItems: mockInventory.filter(item => item.status === 'out-of-stock').length,
    activeSections: mockSections.filter(section => section.status === 'active').length,
    totalValue: 125000,
    categoriesCount: {
      'Pipes & Fittings': 1,
      'Valves': 1,
      'Pumps': 1
    }
  };
  res.json(stats);
});

app.get('/api/inventory/low-stock', (req, res) => {
  const lowStockItems = mockInventory.filter(item => item.status === 'low-stock');
  res.json(lowStockItems);
});

app.get('/api/inventory/:id', (req, res) => {
  const item = mockInventory.find(i => i._id === req.params.id);
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

app.post('/api/inventory', (req, res) => {
  const newItem = {
    _id: String(mockInventory.length + 1),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  mockInventory.push(newItem);
  res.status(201).json(newItem);
});

app.put('/api/inventory/:id', (req, res) => {
  const index = mockInventory.findIndex(i => i._id === req.params.id);
  if (index !== -1) {
    mockInventory[index] = { ...mockInventory[index], ...req.body, updatedAt: new Date().toISOString() };
    res.json(mockInventory[index]);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

app.delete('/api/inventory/:id', (req, res) => {
  const index = mockInventory.findIndex(i => i._id === req.params.id);
  if (index !== -1) {
    mockInventory.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

// Sections routes
app.get('/api/sections', (req, res) => {
  res.json(mockSections);
});

app.get('/api/sections/:id', (req, res) => {
  const section = mockSections.find(s => s._id === req.params.id);
  if (section) {
    res.json(section);
  } else {
    res.status(404).json({ message: 'Section not found' });
  }
});

app.post('/api/sections', (req, res) => {
  const newSection = {
    _id: String(mockSections.length + 1),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  mockSections.push(newSection);
  res.status(201).json(newSection);
});

app.put('/api/sections/:id', (req, res) => {
  const index = mockSections.findIndex(s => s._id === req.params.id);
  if (index !== -1) {
    mockSections[index] = { ...mockSections[index], ...req.body, updatedAt: new Date().toISOString() };
    res.json(mockSections[index]);
  } else {
    res.status(404).json({ message: 'Section not found' });
  }
});

app.delete('/api/sections/:id', (req, res) => {
  const index = mockSections.findIndex(s => s._id === req.params.id);
  if (index !== -1) {
    mockSections.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Section not found' });
  }
});

app.get('/api/sections/:id/inventory', (req, res) => {
  const sectionInventory = mockInventory.filter(item => item.sectionId === req.params.id);
  res.json(sectionInventory);
});

// Dashboard stats
app.get('/api/dashboard', (req, res) => {
  const dashboardData = {
    totalItems: mockInventory.length,
    totalQuantity: mockInventory.reduce((sum, item) => sum + item.quantity, 0),
    lowStockItems: mockInventory.filter(item => item.status === 'low-stock').length,
    outOfStockItems: mockInventory.filter(item => item.status === 'out-of-stock').length,
    activeSections: mockSections.filter(section => section.status === 'active').length,
    recentActivities: [
      { action: 'Stock Updated', item: 'PVC Pipe 4 inch', timestamp: new Date().toISOString() },
      { action: 'Low Stock Alert', item: 'Brass Valve 2 inch', timestamp: new Date().toISOString() },
    ]
  };
  res.json(dashboardData);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Inventory API: http://localhost:${PORT}/api/inventory`);
  console.log(`🏢 Sections API: http://localhost:${PORT}/api/sections`);
});