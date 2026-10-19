import mongoose, { Schema, models } from 'mongoose';

const enrolledProgramSchema = new Schema({
  programId: { type: String, required: true },
  programName: { type: String, required: true },
  enrolledAt: { type: Date, default: Date.now },
  completedModules: { type: [String], default: [] }
}, { _id: false });

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, default: '' },
  role: { type: String, default: 'student', enum: ['student', 'admin'] },
  enrolledPrograms: { type: [enrolledProgramSchema], default: [] }
}, { timestamps: true });

if (models.User) {
  try {
    delete (models as Record<string, unknown>).User;
  } catch {
    // Ignore if not deletable
  }
}

const User = models.User || mongoose.model('User', userSchema);
export default User;