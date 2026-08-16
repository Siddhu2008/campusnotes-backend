const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: [
        'NOTES',
        'QUESTION_PAPER',
        'ASSIGNMENT',
        'PRACTICAL',
        'LAB_MANUAL',
        'STUDY_MATERIAL',
        'CHEAT_SHEET',
        'PROJECT',
        'OTHER',
      ],
      required: true,
    },
    file: {
      url: { type: String, required: true },
      storageKey: { type: String, default: '' },
      originalName: { type: String, required: true },
      mimeType: { type: String, required: true },
      extension: { type: String, required: true },
      size: { type: Number, required: true },
    },
    thumbnailUrl: { type: String, default: '' },
    collegeId: { type: String, default: 'col_tcet' },
    branchId: { type: String, required: true },
    semesterId: { type: String, required: true },
    subjectId: { type: String, required: true },
    unitNumber: { type: Number },
    tags: [{ type: String, trim: true }],
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: [
        'DRAFT',
        'PROCESSING',
        'PENDING_REVIEW',
        'PUBLISHED',
        'REJECTED',
        'ARCHIVED',
        'REMOVED',
      ],
      default: 'PUBLISHED',
    },
    stats: {
      views: { type: Number, default: 0 },
      downloads: { type: Number, default: 0 },
      averageRating: { type: Number, default: 0 },
      ratingCount: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

resourceSchema.index({ branchId: 1, semesterId: 1, subjectId: 1 });
resourceSchema.index({ category: 1 });
resourceSchema.index({ status: 1 });
resourceSchema.index({ 'stats.downloads': -1 });
resourceSchema.index({ 'stats.averageRating': -1 });
resourceSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Resource', resourceSchema);
