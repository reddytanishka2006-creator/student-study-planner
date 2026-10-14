import mongoose from 'mongoose';

const UserDataSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  subjects: { type: Array, default: [] },
  units: { type: Array, default: [] },
  topics: { type: Array, default: [] },
  tasks: { type: Array, default: [] },
  exams: { type: Array, default: [] }
}, { timestamps: true });

export const UserDataModel = mongoose.model('UserData', UserDataSchema);
