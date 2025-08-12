import { Schema, model, Document, Types } from 'mongoose';

interface IFavorite extends Document {
  user: Types.ObjectId;
  car: Types.ObjectId;
  createdAt: Date;
}

const favoriteSchema = new Schema<IFavorite>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Kullanıcı bilgisi zorunludur']
  },
  car: {
    type: Schema.Types.ObjectId,
    ref: 'Car',
    required: [true, 'Araç bilgisi zorunludur']
  }
}, {
  timestamps: { updatedAt: false },
  versionKey: false
});

favoriteSchema.index({ user: 1, car: 1 }, { unique: true });
favoriteSchema.index({ user: 1 });
favoriteSchema.index({ car: 1 });

export const Favorite = model<IFavorite>('Favorite', favoriteSchema);
export type { IFavorite };