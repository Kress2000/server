const mongoose = require('mongoose')
const blog = mongoose.model('blogs', {
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  img: {
    required: true,
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    default: new Date().toISOString(),
  },
  userActions: {
    type: Object,
    comments: {
      type: Array,
    },
    likes: {
      type: Number,
    },
    views: {
      type: Number,
    },
  },
})
module.exports = { blog }
