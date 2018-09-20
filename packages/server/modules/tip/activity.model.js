const Mongoose = require('mongoose')

const Schema = Mongoose.Schema

const activity = new Schema({
  type: { type: String, required: true, enum: ['SEND_TIP', 'REDEEM_TIP', 'REFUND_TIP', 'WITHDRAW', 'WITHDRAW_PROCESSED', 'LOAD_BALANCE'] },
  account: { type: String, required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now() },
  expiredAt: { type: Date },
  metadata: { type: Object },
  tip_id: { type: String }
})

module.exports = Mongoose.model('Activity', activity, 'activity')
