import mongoose from 'mongoose';

const deliverableSchema = new mongoose.Schema(
  {
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
    influencerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Influencer', required: true },
    platform: { type: String, default: '' },
    contentType: { type: String, enum: ['Reel', 'Short', 'Story', 'Challenge', 'Carousel', 'Post', 'Video', 'Blog', 'Other'], default: 'Post' },
    dueDate: { type: Date },
    status: { type: String, enum: ['Planned', 'In Progress', 'Submitted', 'Approved', 'Posted'], default: 'Planned' },
    approval: { type: String, enum: ['Pending', 'Approved', 'Declined'], default: 'Pending' },
    linkToDraft: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Deliverable', deliverableSchema);
