const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    avatarUrl: { type: String, default: '' },
    collegeId: { type: String, default: 'col_tcet' },
    branchId: { type: String, ref: 'Branch' },
    year: { type: Number, min: 1, max: 4, default: 1 },
    semester: { type: Number, min: 1, max: 8, default: 1 },
    role: { type: String, enum: ['student', 'moderator', 'admin'], default: 'student' },
    bio: { type: String, default: '', maxLength: 300 },
    points: { type: Number, default: 0 },
    level: {
      type: String,
      enum: ['Beginner', 'Contributor', 'Scholar', 'Expert', 'Campus Mentor'],
      default: 'Beginner',
    },
    isEmailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });
userSchema.index({ branchId: 1, semester: 1 });
userSchema.index({ points: -1 });

module.exports = mongoose.model('User', userSchema);
