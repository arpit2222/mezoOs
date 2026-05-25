import mongoose, { Document, Schema } from 'mongoose';

export interface IApiKey extends Document {
  merchantAddress: string;
  apiKey: string;
  name: string;
  createdAt: Date;
  lastUsedAt: Date;
  isActive: boolean;
}

const ApiKeySchema = new Schema<IApiKey>(
  {
    merchantAddress: { type: String, required: true, lowercase: true, index: true },
    apiKey: { type: String, required: true, unique: true },
    name: { type: String, required: true, default: 'Default API Key' },
    createdAt: { type: Date, default: Date.now },
    lastUsedAt: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ApiKey = mongoose.model<IApiKey>('ApiKey', ApiKeySchema);
