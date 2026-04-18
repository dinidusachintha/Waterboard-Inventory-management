import mongoose, { Schema, Document } from 'mongoose';

export interface ISection extends Document {
  name: string;
  code: string;
  location: string;
  manager: string;
  contactNumber: string;
  email: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const SectionSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  manager: { type: String, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, {
  timestamps: true
});

export default mongoose.model<ISection>('Section', SectionSchema);