import mongoose from 'mongoose';
const projectSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  status: { type: String, enum: ['planning', 'active', 'completed'], default: 'active' },
  dueDate: { type: Date, default: null }
}, { timestamps: true });
export default mongoose.model('Project', projectSchema);
