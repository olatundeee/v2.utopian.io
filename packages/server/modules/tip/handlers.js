const Boom = require('boom')
const Activity = require('./activity.model')

const redeemTip = async (req, h) => {
  const data = await Activity.findById(req.payload.id)
  if (data.length === 0) Boom.notFound()
  const response = await Activity.save({ ...data[0], tip_id: req.payload.id })
  return h.response(response)
}

const getBalance = async (req, h) => {

}

const getTips = async (req, h) => {
  const data = await Activity.find({ account: req.auth.credentials.username, $or: [{ type: 'SEND_TIP' }, { type: 'REDEEM_TIP' }, { type: 'REFUND_TIP' }] })
  return h.response({ 'total': data.length, 'results': data })
}

const getActivities = async (req, h) => {
  const { sort = 'DESC', filter = null, limit = 20, skip = 0 } = req.params
  let data
  if (filter === null) {
    data = await Activity.find({ account: req.auth.credentials.username }).limit(limit).skip(skip)
  } else if (sort === 'DESC') {
    data = await Activity.find({ account: req.auth.credentials.username }).limit(limit).skip(skip)
  } else if (sort === 'ASC') {

  }

  return h.response({ 'total': data.length, 'results': data })
}

module.exports = {
  redeemTip,
  getBalance,
  getTips,
  getActivities
}
