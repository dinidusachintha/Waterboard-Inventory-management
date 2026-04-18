import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const createTestUser = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/waterboard_inventory');
    
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    // Check if user exists
    const existingUser = await usersCollection.findOne({ email: 'admin@waterboard.com' });
    
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      
      await usersCollection.insertOne({
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
      
      console.log('✅ Admin user created successfully!');
      console.log('📧 Email: admin@waterboard.com');
      console.log('🔑 Password: Admin@123');
    } else {
      console.log('⚠️ Admin user already exists');
    }
    
    // Create some test sections
    const sectionsCollection = db.collection('sections');
    
    const sections = [
      {
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
    
    for (const section of sections) {
      const existingSection = await sectionsCollection.findOne({ code: section.code });
      if (!existingSection) {
        await sectionsCollection.insertOne(section);
        console.log(`✅ Section created: ${section.name}`);
      }
    }
    
    // Create test inventory items
    const inventoryCollection = db.collection('inventories');
    
    const inventoryItems = [
      {
        itemCode: 'ITEM-001',
        itemName: 'PVC Pipe 4 inch',
        category: 'Pipes & Fittings',
        quantity: 150,
        unit: 'Pieces',
        minimumStock: 50,
        maximumStock: 500,
        location: 'Warehouse A',
        sectionId: 'WSS-001',
        supplier: 'ABC Suppliers',
        purchaseDate: new Date('2024-01-15'),
        status: 'in-stock',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        itemCode: 'ITEM-002',
        itemName: 'Brass Valve 2 inch',
        category: 'Valves',
        quantity: 25,
        unit: 'Pieces',
        minimumStock: 30,
        maximumStock: 100,
        location: 'Warehouse B',
        sectionId: 'MS-002',
        supplier: 'ValveCorp',
        purchaseDate: new Date('2024-01-20'),
        status: 'low-stock',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    for (const item of inventoryItems) {
      const existingItem = await inventoryCollection.findOne({ itemCode: item.itemCode });
      if (!existingItem) {
        await inventoryCollection.insertOne(item);
        console.log(`✅ Inventory item created: ${item.itemName}`);
      }
    }
    
    console.log('\n🎉 Test data setup complete!');
    console.log('\n🔐 Login credentials:');
    console.log('   Email: admin@waterboard.com');
    console.log('   Password: Admin@123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createTestUser();