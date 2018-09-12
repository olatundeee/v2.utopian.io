const Handlers = require('./handlers')
const Validate = require('./validate')

const routes = []

routes.push([
  {
    method: 'POST',
    path: '/v1/contribution',
    handler: (req, h, next) => Handlers.saveContribution(req, h, next),
    options: {
      tags: ['api', 'contributions'],
      validate: Validate.saveContribution
    }
  }
])

module.exports = routes
