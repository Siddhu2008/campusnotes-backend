const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource' },
    commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
    reason: {
      type: String,
      enum: [
        'WRONG_SUBJECT',
        'INCORRECT_CONTENT',
        'DUPLICATE',
        'SPAM',
        'INAPPROPRIATE',
        'COPYRIGHT',
        'OTHER',
      ],
      required: true,
    },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['OPEN', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED'],
      default: 'OPEN',
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);
