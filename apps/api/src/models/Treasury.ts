import mongoose, { Schema, Document } from 'mongoose';

export interface ITreasury extends Document {
  walletAddress: string;
  btcCollateral: number;
  musdBorrowed: number;
  mezoLocked: number;
  mezoTier: number;
  healthFactor: number;
}

const TreasurySchema: Schema = new Schema({
  walletAddress: { type: String, required: true, unique: true },
  btcCollateral: { type: Number, default: 0 },
  musdBorrowed: { type: Number, default: 0 },
  mezoLocked: { type: Number, default: 0 },
  mezoTier: { type: Number, default: 0 },
  healthFactor: { type: Number, default: 100 } // percentage 0-100
});

export const Treasury = mongoose.model<ITreasury>('Treasury', TreasurySchema);
