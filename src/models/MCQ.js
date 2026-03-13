import mongoose from 'mongoose';

const mcqSchema = new mongoose.Schema({
  id: { type: String, required: true }, // UUID
  question: { type: String, required: true },
  opa: { type: String, required: true },
  opb: { type: String, required: true },
  opc: { type: String, required: true },
  opd: { type: String, required: true },
  cop: { type: String, required: true }, // correct option key
  choice_type: { type: String },
  exp: { type: String },
  subject_name: { type: String },
  topic_name: { type: String }
});

export default mongoose.models.MCQ || mongoose.model('MCQ', mcqSchema); 