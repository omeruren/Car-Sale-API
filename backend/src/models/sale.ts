import { Schema, model, Document, Types } from 'mongoose';

interface ISale extends Document {
  car: Types.ObjectId;
  seller: Types.ObjectId;
  buyer: Types.ObjectId;
  price: number;
  paymentMethod: 'cash' | 'bank_transfer' | 'credit' | 'installment';
  paymentStatus: 'pending' | 'paid' | 'partially_paid' | 'refunded';
  saleDate: Date;
  deliveryDate?: Date;
  notes?: string;
  documents: {
    contract?: string;
    invoice?: string;
    transferDocument?: string;
    other?: string[];
  };
  status: 'pending' | 'completed' | 'cancelled';
  cancellationReason?: string;
  commission: {
    amount: number;
    percentage: number;
    isPaid: boolean;
    paidDate?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const saleSchema = new Schema<ISale>({
  car: {
    type: Schema.Types.ObjectId,
    ref: 'Car',
    required: [true, 'Car information is required']
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Seller information is required']
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Buyer information is required']
  },
  price: {
    type: Number,
    required: [true, 'Sale price is required'],
    min: [0, 'Price cannot be negative']
  },
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: {
      values: ['cash', 'bank_transfer', 'credit', 'installment'],
      message: 'Please select a valid payment method'
    }
  },
  paymentStatus: {
    type: String,
    required: [true, 'Payment status is required'],
    enum: {
      values: ['pending', 'paid', 'partially_paid', 'refunded'],
      message: 'Please select a valid payment status'
    },
    default: 'pending'
  },
  saleDate: {
    type: Date,
    required: [true, 'Sale date is required'],
    default: Date.now
  },
  deliveryDate: {
    type: Date
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes must be at most 1000 characters long']
  },
  documents: {
    contract: {
      type: String,
      trim: true
    },
    invoice: {
      type: String,
      trim: true
    },
    transferDocument: {
      type: String,
      trim: true
    },
    other: {
      type: [String],
      validate: {
        validator: function(docs: string[]) {
          return docs.length <= 10;
        },
        message: 'You can add at most 10 additional documents'
      }
    }
  },
  status: {
    type: String,
    required: [true, 'Sale status is required'],
    enum: {
      values: ['pending', 'completed', 'cancelled'],
      message: 'Please select a valid sale status'
    },
    default: 'pending'
  },
  cancellationReason: {
    type: String,
    trim: true,
    maxlength: [500, 'Cancellation reason must be at most 500 characters long']
  },
  commission: {
    amount: {
      type: Number,
      required: [true, 'Commission amount is required'],
      min: [0, 'Commission cannot be negative']
    },
    percentage: {
      type: Number,
      required: [true, 'Commission percentage is required'],
      min: [0, 'Commission percentage cannot be negative'],
      max: [100, 'Commission percentage cannot exceed 100']
    },
    isPaid: {
      type: Boolean,
      default: false
    },
    paidDate: {
      type: Date
    }
  }
}, {
  timestamps: true,
  versionKey: false
});

// Pre-save validation middleware
saleSchema.pre('save', function(next) {
  // Validate delivery date
  if (this.deliveryDate && this.deliveryDate < this.saleDate) {
    return next(new Error('Delivery date cannot be before sale date'));
  }
  
  // Validate cancellation reason
  if (this.status === 'cancelled' && !this.cancellationReason) {
    return next(new Error('Cancellation reason is required when status is cancelled'));
  }
  
  // Validate commission paid date
  if (this.commission.isPaid && !this.commission.paidDate) {
    return next(new Error('Commission payment date is required when commission is marked as paid'));
  }
  
  next();
});

saleSchema.index({ car: 1 });
saleSchema.index({ seller: 1 });
saleSchema.index({ buyer: 1 });
saleSchema.index({ saleDate: -1 });
saleSchema.index({ status: 1 });
saleSchema.index({ paymentStatus: 1 });
saleSchema.index({ 'commission.isPaid': 1 });

export const Sale = model<ISale>('Sale', saleSchema);
export type { ISale };