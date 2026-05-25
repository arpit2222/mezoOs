import mongoose, { Schema, Document } from 'mongoose';

export interface IEventLog extends Document {
  walletAddress: string;
  eventType: 'invoice_created' | 'invoice_paid' | 'subscription_created' | 'subscription_charged' | 'subscription_paused' | 'automation_triggered' | 'mezo_tier_changed';
  txHash?: string;
  metadata: Record<string, any>;
  createdAt: Date;
}

const EventLogSchema: Schema = new Schema({
  walletAddress: { type: String, required: true },
  eventType: { type: String, required: true },
  txHash: { type: String },
  metadata: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});

export const EventLog = mongoose.model<IEventLog>('EventLog', EventLogSchema);
