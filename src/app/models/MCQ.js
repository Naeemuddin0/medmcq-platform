import mongoose from 'mongoose';

const mcqSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  explanation: { type: String, required: true }
});

export default mongoose.models.MCQ || mongoose.model('MCQ', mcqSchema); 