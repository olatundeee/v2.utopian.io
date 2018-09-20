const Joi = require('joi')

const redeemTip = {
  payload: {
    id: Joi.string().trim().required()
  }
}

module.exports = {
  redeemTip
}
