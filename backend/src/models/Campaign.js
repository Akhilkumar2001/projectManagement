import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    startDate: { type: Date },
    endDate: { type: Date },
    objective: { type: String, default: '' },
    targetAudience: { type: String, default: '' },
    primaryPlatform: { type: String, default: '' },
    totalBudget: { type: Number, default: 0 },
    currency: { type: String, default: '$' },
    keyBrandMessage: { type: String, default: '' },
    creativeBrief: { type: String, default: '' },
    kpis: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Campaign', campaignSchema);
