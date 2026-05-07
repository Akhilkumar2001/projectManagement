import mongoose from 'mongoose';

const subtaskSchema = new mongoose.Schema(
  {
    parentTaskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'submitted', 'approved', 'rejected'],
      default: 'todo',
    },
    dueDate: { type: Date },
    images: [
      {
        url: { type: String },
        filename: { type: String },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    rejectionReason: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Subtask', subtaskSchema);
