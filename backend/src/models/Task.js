import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'submitted', 'approved', 'rejected'],
      default: 'todo',
    },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    dueDate: { type: Date },
    images: [
      {
        url: { type: String },
        filename: { type: String },
        uploadedAt: { type: Date, default: Date.now },
        caption: { type: String, default: '' },
      },
    ],
    clientVisible: { type: Boolean, default: true },   // admin decides if client can see
    proofRequired: { type: Boolean, default: false },
    rejectionReason: { type: String, default: '' },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date },
    timeSpent: { type: Number, default: 0 },
    estimatedTime: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Task', taskSchema);
