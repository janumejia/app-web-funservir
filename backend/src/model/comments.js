const {model, Schema} = require("mongoose") 

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
  stars:{
    type: Number,
    required: true
  },
  content: {
    type: String,
    required: true,
  }
},{ timestamps: true });

module.exports = model('Comment', commentSchema);