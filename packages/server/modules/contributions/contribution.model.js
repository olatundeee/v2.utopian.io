const Mongoose = require('mongoose')

const Schema = Mongoose.Schema

const contributions = new Schema({
  title: { type: String, required: true, text: true },
  slug: { type: String, required: true, index: { unique: true } },
  category: { type: String, required: true },
  markdownBody: { type: String, required: true, text: true },
  htmlBody: { type: String, required: true, text: true },
  comments: [{ type: Object }], // this will be an array of comments when we create the comment model
  votes: [{ type: Object }], // this will be an array of votes when we create the vote model
  url: { type: String, required: true },
  author: { type: String, required: true, ref: 'Users' },
  pendingPayoutValue: { type: Number, default: 0 },
  repositories: [{
    _id: false,
    type: {
      type: String,
      enum: ['github'],
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
      type: Object
    }
  }],
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date },
  deletedAt: { type: Date }
})

module.exports = Mongoose.model('Contribution', contributions, 'contributions')
