import mongoose from 'mongoose';

const suggestionSchema = new mongoose.Schema(
  {
    keyword: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    suggestion: {
      type: String,
      required: true,
      trim: true
    },
    seoScore: {
      type: Number,
      required: true,
      min: 1,
      max: 100
    },
    difficulty: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      required: true
    },
    estimatedVolume: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

suggestionSchema.index({ keyword: 1, createdAt: -1 });

export const Suggestion = mongoose.model('Suggestion', suggestionSchema);
