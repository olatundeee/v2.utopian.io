const Handlers = require('./handlers')
const Validate = require('./validate')

const routes = []

routes.push([
  {
    method: 'POST',
    path: '/api/v1/contributions',
    handler: (req, h, next) => Handlers.getContributions(req, h, next),
    options: {
      auth: false,
      tags: ['api', 'contributions'],
      validate: Validate.getContributions
    }
  },
  {
    method: 'GET',
    path: '/api/v1/contribution/{slug}',
    handler: (req, h, next) => Handlers.getContributionBySlug(req, h, next),
    options: {
      auth: false,
      tags: ['api', 'contributions'],
      validate: Validate.getContributionBySlug
    }
  },
  {
    method: 'DELETE',
    path: '/api/v1/contribution/{slug}',
    handler: (req, h, next) => Handlers.deleteContributionBySlug(req, h, next),
    options: {
      tags: ['api', 'contributions'],
      validate: Validate.deleteContributionBySlug
    }
  },
  {
    method: 'PUT',
    path: '/api/v1/contribution/{slug}',
    handler: (req, h, next) => Handlers.editContributionBySlug(req, h, next),
    options: {
      tags: ['api', 'contributions'],
      validate: Validate.editContributionBySlug
    }
  },
  {
    method: 'POST',
    path: '/api/v1/contribution',
    handler: (req, h, next) => Handlers.saveContribution(req, h, next),
    options: {
      tags: ['api', 'contributions'],
      validate: Validate.saveContribution
    }
  }
])

module.exports = routes
