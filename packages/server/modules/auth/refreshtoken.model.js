const Mongoose = require('mongoose')

const Schema = Mongoose.Schema

const refreshTokens = new Schema({
  refreshToken: {
    type: String,
    unique: true,
    required: true
  },
  scope: {
    type: String,
    required: true
  },
  user: { type: Schema.Types.ObjectId, ref: 'Users' }
})

module.exports = Mongoose.model('RefreshToken', refreshTokens, 'refreshtoken')
