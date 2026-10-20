import mongoose, { Schema, models } from 'mongoose';

const moduleSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  subtopics: { type: [String], default: [] }
}, { _id: false });

const programSchema = new Schema({
  programId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  badge: { type: String, default: 'Active Cohort' },
  schedule: { type: String, default: '' },
  duration: { type: String, default: '4 Months' },
  link: { type: String, default: '' },
  modules: { type: [moduleSchema], default: [] }
}, { timestamps: true });

if (models.Program) {
  try {
    delete (models as Record<string, unknown>).Program;
  } catch {
    // Ignore
  }
}

const Program = models.Program || mongoose.model('Program', programSchema);
export default Program;
