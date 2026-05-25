import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoice extends Document {
  senderWallet: string;
  recipientWallet: string;
  amount: number;
  memo: string;
  dueDate: Date;
  status: 'pending' | 'paid' | 'overdue';
  onchainInvoiceId?: string;
  createdAt: Date;
}

const InvoiceSchema: Schema = new Schema({
  senderWallet: { type: String, required: true },
  recipientWallet: { type: String, required: true },
  amount: { type: Number, required: true },
  memo: { type: String },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' },
  onchainInvoiceId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const Invoice = mongoose.model<IInvoice>('Invoice', InvoiceSchema);
