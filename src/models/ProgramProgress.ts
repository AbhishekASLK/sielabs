import mongoose, { Schema, models } from 'mongoose';

const programProgressSchema = new Schema({
  programId: { type: String, required: true, unique: true },
  completedModules: { type: [String], default: [] }
}, { timestamps: true });

if (models.ProgramProgress) {
  try {
    delete (models as Record<string, unknown>).ProgramProgress;
  } catch {
    // Ignore
  }
}

const ProgramProgress = models.ProgramProgress || mongoose.model('ProgramProgress', programProgressSchema);
export default ProgramProgress;
