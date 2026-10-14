import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' },
  major: { type: String, default: 'Computer Science & Engineering' },
  semester: { type: String, default: '5th Semester' },
  targetGpa: { type: String, default: '9.4 / 10.0' },
  studyGoalHoursPerWeek: { type: Number, default: 28 },
  bio: { type: String, default: '' },
  createdAt: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true });

export const UserModel = mongoose.model('User', UserSchema);
