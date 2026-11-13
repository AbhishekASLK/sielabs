import mongoose, { Schema, models } from 'mongoose';

const inquirySchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: false, default: '', trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  program: { type: String, default: 'General Inquiry' },
  message: { type: String, default: '', trim: true },
  status: { type: String, default: 'new', enum: ['new', 'contacted', 'enrolled', 'closed'] }
}, { timestamps: true });

if (models.Inquiry) {
  try {
    delete (models as Record<string, unknown>).Inquiry;
  } catch {
    // Ignore if not deletable
  }
}

const Inquiry = models.Inquiry || mongoose.model('Inquiry', inquirySchema);
export default Inquiry;
