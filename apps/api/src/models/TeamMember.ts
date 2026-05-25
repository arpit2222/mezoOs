import mongoose, { Schema, Document } from 'mongoose';

export interface ITeamMember extends Document {
  treasuryWallet: string;
  memberWallet: string;
  role: 'owner' | 'finance' | 'operator';
  createdAt: Date;
}

const TeamMemberSchema: Schema = new Schema({
  treasuryWallet: { type: String, required: true },
  memberWallet: { type: String, required: true },
  role: { type: String, enum: ['owner', 'finance', 'operator'], default: 'operator' },
  createdAt: { type: Date, default: Date.now }
});

export const TeamMember = mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema);
