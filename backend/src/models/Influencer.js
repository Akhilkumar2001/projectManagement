import mongoose from 'mongoose';

const influencerSchema = new mongoose.Schema(
  {
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
    name: { type: String, required: true, trim: true },
    platform: { type: String, enum: ['Instagram', 'TikTok', 'YouTube', 'Facebook', 'X', 'Pinterest', 'LinkedIn', 'Threads', 'Reddit'], default: 'Instagram' },
    contactEmail: { type: String, default: '' },
    handle: { type: String, default: '' },
    followerCount: { type: Number, default: 0 },
    totalEngagement: { type: Number, default: 0 },
    niche: { type: String, default: '' },
    country: { type: String, default: '' },
    gender: { type: String, default: '' },
    status: { type: String, enum: ['Lead', 'Contacted', 'Confirmed', 'Declined'], default: 'Lead' },
    shippingAddress: { type: String, default: '' },
    productShipped: { type: String, enum: ['', 'Yes', 'No'], default: '' },
    productStatus: { type: String, default: '' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Auto-calculate engagement rate
influencerSchema.virtual('engagementRate').get(function () {
  if (!this.followerCount || this.followerCount === 0) return 0;
  return parseFloat(((this.totalEngagement / this.followerCount) * 100).toFixed(2));
});

export default mongoose.model('Influencer', influencerSchema);
