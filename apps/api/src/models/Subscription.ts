import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  subscriberWallet: string;
  merchantWallet: string;
  title: string;
  amount: number;
  intervalDays: number;
  status: 'active' | 'paused' | 'cancelled';
  onchainSubId?: string;
  lastPaymentDate?: Date;
  nextPaymentDate: Date;
  createdAt: Date;
}

const SubscriptionSchema: Schema = new Schema({
  subscriberWallet: { type: String, required: true },
  merchantWallet: { type: String, required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  intervalDays: { type: Number, required: true },
  status: { type: String, enum: ['active', 'paused', 'cancelled'], default: 'active' },
  onchainSubId: { type: String },
  lastPaymentDate: { type: Date },
  nextPaymentDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Subscription = mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
