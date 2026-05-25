import mongoose, { Schema, Document } from 'mongoose';

export interface IAutomationRule extends Document {
  walletAddress: string;
  triggerType: 'invoice_due' | 'health_low' | 'payment_failed';
  actionType: 'auto_pay' | 'pause_subs' | 'retry_payment';
  conditions: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
}

const AutomationRuleSchema: Schema = new Schema({
  walletAddress: { type: String, required: true },
  triggerType: { type: String, required: true },
  actionType: { type: String, required: true },
  conditions: { type: Schema.Types.Mixed },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export const AutomationRule = mongoose.model<IAutomationRule>('AutomationRule', AutomationRuleSchema);
