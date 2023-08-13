const { model, Schema } = require("mongoose")

const commentSchema = new Schema({
  siteId: {
    type: Schema.Types.ObjectId,
    ref: 'Site',
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  stars: {
    type: Number,
    required: true
  },
  content: {
    type: String,
    required: true,
  },
  reviewFields: [
    {
      ratingFieldName: { type: String },
      rating: { type: Number },
    }
  ],
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  dislikes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  isReported: {
    type: Boolean,
    default: false, // Default value for the new property
  },
  reportedBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
}, { timestamps: true });

module.exports = model('Comment', commentSchema);