const Handlers = require('./handlers')
const Validate = require('./validate')

const routes = []

routes.push([
  {
    method: 'POST',
    path: '/v1/tip/redeem',
    handler: (req, h, next) => Handlers.redeemTip(req, h, next),
    options: {
      tags: ['api', 'tip'],
      validate: Validate.redeemTip
    }
  },
  {
    method: 'GET',
    path: '/v1/tip/balance',
    handler: (req, h, next) => Handlers.getBalance(req, h, next),
    options: {
      tags: ['api', 'tip']
    }
  },
  {
    method: 'GET',
    path: '/v1/tip/tips',
    handler: (req, h, next) => Handlers.getTips(req, h, next),
    options: {
      tags: ['api', 'tip']
    }
  },
  {
    method: 'GET',
    path: '/v1/tip/activities',
    handler: (req, h, next) => Handlers.getActivities(req, h, next),
    options: {
      tags: ['api', 'tip']
    }
  }
])

module.exports = routes
