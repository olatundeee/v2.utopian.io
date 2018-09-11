const Mongoose = require('mongoose')

const Schema = Mongoose.Schema

const contributions = new Schema({
  title: { type: String, required: true, text: true },
  slug: { type: String, required: true, index: { unique: true } },
  category: { type: String, required: true, text: true },
  markdownBody: { type: String, required: true, text: true },
  htmlBody: { type: String, required: true, text: true },
  comments: [{ type: Object, required: true }], // this will be an array of comments when we create the comment model
  url: { type: String, required: true, text: true },
  author: { type: String, required: true },
  pendingPayoutValue: { type: String, required: true, text: true },
  repositories: [{
    _id: false,
    type: {
      type: String,
      enum: ['github'],
      required: true
    },
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  }],
  blockchains: [{
    _id: false,
    type: {
      type: String,
      enum: ['steem'],
      required: true
    },
    metadata: {
      type: Object,
      required: true
    }
  }],
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date },
  deletedAt: { type: Date }
})

module.exports = Mongoose.model('Contribution', contributions, 'contributions')
