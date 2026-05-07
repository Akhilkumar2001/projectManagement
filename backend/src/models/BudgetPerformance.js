import mongoose from 'mongoose';

const budgetPerformanceSchema = new mongoose.Schema(
  {
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
    influencerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Influencer', required: true },
    contentType: { type: String, default: '' },
    fee: { type: Number, default: 0 },
    paid: { type: String, enum: ['', 'Yes', 'No'], default: '' },
    impressions: { type: Number, default: 0 },
    reach: { type: Number, default: 0 },
    engagements: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
    estimatedRevenue: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Auto-calculated fields
budgetPerformanceSchema.virtual('costPerEngagement').get(function () {
  if (!this.engagements || this.engagements === 0) return 0;
  return parseFloat((this.fee / this.engagements).toFixed(2));
});

budgetPerformanceSchema.virtual('targetROI').get(function () {
  if (!this.fee || this.fee === 0) return 0;
  return parseFloat((((this.estimatedRevenue - this.fee) / this.fee) * 100).toFixed(0));
});

export default mongoose.model('BudgetPerformance', budgetPerformanceSchema);
