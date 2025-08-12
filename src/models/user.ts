import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  role: 'admin' | 'seller' | 'buyer';
  isActive: boolean;
  avatar?: string;
  address?: {
    city: string;
    district: string;
    fullAddress: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters long'],
    maxlength: [50, 'First name must be at most 50 characters long']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters long'],
    maxlength: [50, 'Last name must be at most 50 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^(\+90|0)?[0-9]{10}$/, 'Please provide a valid phone number']
  },
  role: {
    type: String,
    enum: ['admin', 'seller', 'buyer'],
    default: 'buyer'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  avatar: {
    type: String,
    trim: true
  },
  address: {
    city: {
      type: String,
      trim: true
    },
    district: {
      type: String,
      trim: true
    },
    fullAddress: {
      type: String,
      trim: true
    }
  }
}, {
  timestamps: true,
  versionKey: false
});

userSchema.index({ role: 1 });

export const User = model<IUser>('User', userSchema);
export type { IUser };