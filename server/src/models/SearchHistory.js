import mongoose from 'mongoose';

const seoBreakdownSchema = new mongoose.Schema(
  {
    title: { type: Number, default: 0 },
    metaDescription: { type: Number, default: 0 },
    headings: { type: Number, default: 0 },
    imageAlt: { type: Number, default: 0 },
    contentStructure: { type: Number, default: 0 }
  },
  { _id: false }
);

const pageSpeedSchema = new mongoose.Schema(
  {
    score: { type: Number, default: 0 },
    loadTime: { type: Number, default: 0 },
    ttfb: { type: Number, default: 0 },
    fcp: { type: Number, default: 0 },
    lcp: { type: Number, default: 0 },
    cls: { type: Number, default: 0 }
  },
  { _id: false }
);

const searchHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    url: { type: String, required: true, trim: true },
    domain: { type: String, required: true },
    seoScore: { type: Number, required: true, min: 0, max: 100 },
    seoBreakdown: { type: seoBreakdownSchema, default: () => ({}) },
    pageSpeed: { type: pageSpeedSchema, default: () => ({}) },
    keywords: [{ type: String }],
    issues: [{ type: String }],
    suggestions: [{ type: String }]
  },
  { timestamps: true }
);

searchHistorySchema.index({ userId: 1, createdAt: -1 });
searchHistorySchema.index({ domain: 1 });

export const SearchHistory = mongoose.model('SearchHistory', searchHistorySchema);
