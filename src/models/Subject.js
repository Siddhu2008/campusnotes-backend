const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, uppercase: true },
    branchId: { type: String, required: true },
    semesterId: { type: String, required: true },
    description: { type: String, default: '' },
    units: [
      {
        number: { type: Number, required: true },
        title: { type: String, required: true },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

subjectSchema.index({ branchId: 1, semesterId: 1 });

module.exports = mongoose.model('Subject', subjectSchema);
