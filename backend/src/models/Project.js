import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    employees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: {
      type: String,
      enum: ['planning', 'active', 'on_hold', 'completed', 'cancelled'],
      default: 'planning',
    },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    startDate: { type: Date },
    endDate: { type: Date },
    budget: { type: Number, default: 0 },
    tags: [{ type: String }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Project', projectSchema);
