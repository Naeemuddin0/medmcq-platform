import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  subject: { type: String, required: true },
  currentIndex: { type: Number, default: 0 },
  completedQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MCQ' }]
});

export default mongoose.models.Progress || mongoose.model('Progress', progressSchema); 