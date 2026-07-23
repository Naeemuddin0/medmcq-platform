import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  documentName: { type: String },
  questions: [{
    question: { type: String, required: true },
    options: {
      a: { type: String, required: true },
      b: { type: String, required: true },
      c: { type: String, required: true },
      d: { type: String, required: true }
    },
    correctAnswer: { type: String, enum: ['a', 'b', 'c', 'd'], required: true },
    explanation: { type: String, required: true }
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Quiz || mongoose.model('Quiz', quizSchema);
