import mongoose, { Schema, Document } from 'mongoose';

export interface IInventory extends Document {
  itemCode: string;
  itemName: string;
  category: string;
  quantity: number;
  unit: string;
  minimumStock: number;
  maximumStock: number;
  location: string;
  sectionId: mongoose.Types.ObjectId;
  supplier: string;
  purchaseDate: Date;
  expiryDate?: Date;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InventorySchema: Schema = new Schema({
  itemCode: { type: String, required: true, unique: true },
  itemName: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  unit: { type: String, required: true },
  minimumStock: { type: Number, required: true, min: 0 },
  maximumStock: { type: Number, required: true, min: 0 },
  location: { type: String, required: true },
  sectionId: { type: Schema.Types.ObjectId, ref: 'Section', required: true },
  supplier: { type: String, required: true },
  purchaseDate: { type: Date, required: true },
  expiryDate: { type: Date },
  status: { 
    type: String, 
    enum: ['in-stock', 'low-stock', 'out-of-stock'],
    default: 'in-stock'
  },
  notes: { type: String }
}, {
  timestamps: true
});

// Update status before saving
InventorySchema.pre('save', function(next) {
  if (this.quantity <= 0) {
    this.status = 'out-of-stock';
  } else if (this.quantity <= this.minimumStock) {
    this.status = 'low-stock';
  } else {
    this.status = 'in-stock';
  }
  next();
});

export default mongoose.model<IInventory>('Inventory', InventorySchema);