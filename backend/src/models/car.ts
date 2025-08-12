import { Schema, model, Document, Types } from 'mongoose';

interface ICar extends Document {
  title: string;
  description: string;
  brand: Types.ObjectId;
  carModel: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: 'gasoline' | 'diesel' | 'hybrid' | 'electric' | 'lpg';
  transmission: 'manual' | 'automatic';
  bodyType: 'sedan' | 'hatchback' | 'suv' | 'coupe' | 'convertible' | 'wagon' | 'pickup';
  color: string;
  engineSize: number;
  horsepower?: number;
  drivetrain: 'fwd' | 'rwd' | 'awd' | '4wd';
  condition: 'new' | 'used' | 'certified';
  features: string[];
  images: string[];
  location: {
    city: string;
    district: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  seller: Types.ObjectId;
  category: Types.ObjectId;
  status: 'active' | 'sold' | 'pending' | 'inactive';
  viewCount: number;
  favoriteCount: number;
  isPromoted: boolean;
  promotedUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const carSchema = new Schema<ICar>({
  title: {
    type: String,
    required: [true, 'Car title is required'],
    trim: true,
    minlength: [10, 'Title must be at least 10 characters long'],
    maxlength: [100, 'Title must be at most 100 characters long']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [50, 'Description must be at least 50 characters long'],
    maxlength: [2000, 'Description must be at most 2000 characters long']
  },
  brand: {
    type: Schema.Types.ObjectId,
    ref: 'Brand',
    required: [true, 'Brand selection is required']
  },
  carModel: {
    type: String,
    required: [true, 'Model is required'],
    trim: true,
    maxlength: [50, 'Model name must be at most 50 characters long']
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1900, 'Year must be greater than 1900'],
    max: [new Date().getFullYear() + 1, 'Please enter a valid year']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  mileage: {
    type: Number,
    required: [true, 'Mileage is required'],
    min: [0, 'Mileage cannot be negative']
  },
  fuelType: {
    type: String,
    required: [true, 'Fuel type is required'],
    enum: {
      values: ['gasoline', 'diesel', 'hybrid', 'electric', 'lpg'],
      message: 'Please select a valid fuel type'
    }
  },
  transmission: {
    type: String,
    required: [true, 'Transmission type is required'],
    enum: {
      values: ['manual', 'automatic'],
      message: 'Please select a valid transmission type'
    }
  },
  bodyType: {
    type: String,
    required: [true, 'Body type is required'],
    enum: {
      values: ['sedan', 'hatchback', 'suv', 'coupe', 'convertible', 'wagon', 'pickup'],
      message: 'Please select a valid body type'
    }
  },
  color: {
    type: String,
    required: [true, 'Color is required'],
    trim: true,
    maxlength: [30, 'Color name must be at most 30 characters long']
  },
  engineSize: {
    type: Number,
    required: [true, 'Engine size is required'],
    min: [0.1, 'Engine size must be valid'],
    max: [10, 'Engine size must be valid']
  },
  horsepower: {
    type: Number,
    min: [1, 'Horsepower must be positive'],
    max: [2000, 'Horsepower must be valid']
  },
  drivetrain: {
    type: String,
    required: [true, 'Drivetrain is required'],
    enum: {
      values: ['fwd', 'rwd', 'awd', '4wd'],
      message: 'Please select a valid drivetrain'
    }
  },
  condition: {
    type: String,
    required: [true, 'Condition is required'],
    enum: {
      values: ['new', 'used', 'certified'],
      message: 'Please select a valid condition'
    }
  },
  features: {
    type: [String],
    validate: {
      validator: function(features: string[]) {
        return features.length <= 50;
      },
      message: 'You can add at most 50 features'
    }
  },
  images: {
    type: [String],
    required: [true, 'At least one image is required'],
    validate: {
      validator: function(images: string[]) {
        return images.length >= 1 && images.length <= 20;
      },
      message: 'You can add between 1 and 20 images'
    }
  },
  location: {
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true
    },
    coordinates: {
      lat: {
        type: Number,
        min: [-90, 'Latitude must be valid'],
        max: [90, 'Latitude must be valid']
      },
      lng: {
        type: Number,
        min: [-180, 'Longitude must be valid'],
        max: [180, 'Longitude must be valid']
      }
    }
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Seller information is required']
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category selection is required']
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'pending', 'inactive'],
    default: 'active'
  },
  viewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  favoriteCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isPromoted: {
    type: Boolean,
    default: false
  },
  promotedUntil: {
    type: Date,
    validate: {
      validator: function(date: Date) {
        return !this.isPromoted || (this.isPromoted && date);
      },
      message: 'Promotion end date is required'
    }
  }
}, {
  timestamps: true,
  versionKey: false
});

carSchema.index({ brand: 1, carModel: 1 });
carSchema.index({ price: 1 });
carSchema.index({ year: 1 });
carSchema.index({ mileage: 1 });
carSchema.index({ fuelType: 1 });
carSchema.index({ transmission: 1 });
carSchema.index({ 'location.city': 1, 'location.district': 1 });
carSchema.index({ seller: 1 });
carSchema.index({ category: 1 });
carSchema.index({ status: 1 });
carSchema.index({ createdAt: -1 });
carSchema.index({ viewCount: -1 });
carSchema.index({ isPromoted: -1, promotedUntil: 1 });

export const Car = model<ICar>('Car', carSchema);
export type { ICar };