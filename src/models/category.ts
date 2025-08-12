import { Schema, model, Document } from 'mongoose';

interface ICategory extends Document {
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
    minlength: [2, 'Category name must be at least 2 characters long'],
    maxlength: [50, 'Category name must be at most 50 characters long']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description must be at most 500 characters long']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  versionKey: false
});


export const Category = model<ICategory>('Category', categorySchema);
export type { ICategory };