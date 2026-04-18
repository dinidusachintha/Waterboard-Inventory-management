import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory database
let users: any[] = [];
let sections: any[] = [];
let inventory: any[] = [];

// Create default admin user
const createDefaultAdmin = async () => {
  const adminExists = users.find(u => u.email === 'admin@waterboard.com');
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    users.push({
      _id: '1',
      username: 'admin',
      email: 'admin@waterboard.com',
      password: hashedPassword,
      fullName: 'System Administrator',
      role: 'admin',
      department: 'IT Administration',
      phoneNumber: '+1234567890',
      isActive: true,
      isEmailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ Default admin user created');
  }
};

// Create default sections
const createDefaultSections = () => {
  if (sections.length === 0) {
    sections = [
      {
        _id: '1',
        name: 'Water Supply Section',
        code: 'WSS-001',
        location: 'Main Building, Floor 2',
        manager: 'John Doe',
        contactNumber: '+1234567890',
        email: 'water.supply@waterboard.com',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: '2',
        name: 'Maintenance Section',
        code: 'MS-002',
        location: 'Service Center',
        manager: 'Jane Smith',
        contactNumber: '+1234567891',
        email: 'maintenance@waterboard.com',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    console.log('✅ Default sections created');
  }
};

// Create default inventory
const createDefaultInventory = () => {
  if (inventory.length === 0) {
    inventory = [
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
        supplier: 'ABC Suppliers',
        purchaseDate: new Date('2024-01-15'),
        status: 'in-stock',
        notes: 'High quality PVC pipes',
        createdAt: new Date(),
        updatedAt: new Date()
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
        supplier: 'ValveCorp',
        purchaseDate: new Date('2024-01-20'),
        status: 'low-stock',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    console.log('✅ Default inventory items created');
  }
};

// Generate JWT Token
const generateToken = (userId: string, email: string, role: string) => {
  return jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '7d' }
  );
};

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    
    const token = generateToken(user._id, user.email, user.role);
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        department: user.department,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/auth/request-otp', async (req, res) => {
  try {
    const { email } = req.body;
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`=================================`);
    console.log(`🔐 OTP for ${email}: ${otp}`);
    console.log(`=================================`);
    
    res.json({ message: 'OTP sent successfully', dev_otp: otp });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // For demo, accept any 6-digit OTP
    if (!otp || otp.length !== 6) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    
    const token = generateToken(user._id, user.email, user.role);
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        department: user.department,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/auth/profile', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = users.find(u => u.email === decoded.email);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      department: user.department,
      phoneNumber: user.phoneNumber
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

app.put('/api/auth/profile', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const userIndex = users.findIndex(u => u.email === decoded.email);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    users[userIndex] = { ...users[userIndex], ...req.body };
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: users[userIndex]._id,
        username: users[userIndex].username,
        email: users[userIndex].email,
        fullName: users[userIndex].fullName,
        role: users[userIndex].role,
        department: users[userIndex].department,
        phoneNumber: users[userIndex].phoneNumber
      }
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Inventory Routes
app.get('/api/inventory', (req, res) => {
  const populatedInventory = inventory.map(item => ({
    ...item,
    sectionName: sections.find(s => s._id === item.sectionId)?.name
  }));
  res.json({ items: populatedInventory, total: populatedInventory.length, page: 1, totalPages: 1 });
});

app.get('/api/inventory/stats', (req, res) => {
  const stats = {
    totalItems: inventory.length,
    totalQuantity: inventory.reduce((sum, item) => sum + item.quantity, 0),
    lowStockItems: inventory.filter(item => item.status === 'low-stock').length,
    outOfStockItems: inventory.filter(item => item.status === 'out-of-stock').length,
    categoriesCount: {
      'Pipes & Fittings': 1,
      'Valves': 1
    }
  };
  res.json(stats);
});

app.get('/api/inventory/low-stock', (req, res) => {
  const lowStockItems = inventory.filter(item => item.status === 'low-stock');
  res.json(lowStockItems);
});

app.get('/api/inventory/:id', (req, res) => {
  const item = inventory.find(i => i._id === req.params.id);
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

app.post('/api/inventory', (req, res) => {
  const newItem = {
    _id: String(inventory.length + 1),
    ...req.body,
    status: req.body.quantity <= 0 ? 'out-of-stock' : req.body.quantity <= req.body.minimumStock ? 'low-stock' : 'in-stock',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  inventory.push(newItem);
  res.status(201).json(newItem);
});

app.put('/api/inventory/:id', (req, res) => {
  const index = inventory.findIndex(i => i._id === req.params.id);
  if (index !== -1) {
    inventory[index] = { ...inventory[index], ...req.body, updatedAt: new Date() };
    res.json(inventory[index]);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

app.delete('/api/inventory/:id', (req, res) => {
  const index = inventory.findIndex(i => i._id === req.params.id);
  if (index !== -1) {
    inventory.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

// Sections Routes
app.get('/api/sections', (req, res) => {
  res.json(sections);
});

app.get('/api/sections/:id', (req, res) => {
  const section = sections.find(s => s._id === req.params.id);
  if (section) {
    res.json(section);
  } else {
    res.status(404).json({ message: 'Section not found' });
  }
});

app.post('/api/sections', (req, res) => {
  const newSection = {
    _id: String(sections.length + 1),
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  sections.push(newSection);
  res.status(201).json(newSection);
});

app.put('/api/sections/:id', (req, res) => {
  const index = sections.findIndex(s => s._id === req.params.id);
  if (index !== -1) {
    sections[index] = { ...sections[index], ...req.body, updatedAt: new Date() };
    res.json(sections[index]);
  } else {
    res.status(404).json({ message: 'Section not found' });
  }
});

app.delete('/api/sections/:id', (req, res) => {
  const index = sections.findIndex(s => s._id === req.params.id);
  if (index !== -1) {
    sections.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Section not found' });
  }
});

app.get('/api/sections/:id/inventory', (req, res) => {
  const sectionInventory = inventory.filter(item => item.sectionId === req.params.id);
  res.json(sectionInventory);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date(), message: 'Server is running with in-memory database' });
});

// Initialize data
const init = async () => {
  await createDefaultAdmin();
  createDefaultSections();
  createDefaultInventory();
  console.log('✅ All default data created');
};

init();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Using in-memory database`);
  console.log(`🔐 Default admin: admin@waterboard.com / Admin@123`);
  console.log(`📧 OTP will be shown in console`);
});