const Joi = require('joi')

const categories = [
  'ideas',
  'development',
  'bug-hunting',
  'translations',
  'graphics',
  'analysis',
  'social',
  'documentation',
  'tutorials',
  'video-tutorials',
  'copywriting',
  'blog'
]

const saveContribution = {
  payload: {
    title: Joi.string().trim().required(),
    category: Joi.string().required().allow(categories),
    markdownBody: Joi.string().trim().required(),
    author: Joi.string().trim().lowercase().required().min(3).max(32).regex(/^[A-Za-z0-9]+(?:[._-][A-Za-z0-9]+)*$/),
    repositories: Joi.array().optional().items(
      Joi.object({
        type: Joi.string().required().trim().allow('github'),
        name: Joi.object().required()
      })
    ),
    blockchains: Joi.array().optional().items(
      Joi.object({
        type: Joi.string().required().trim().allow('steem'),
        metadata: Joi.object().optional()
      })
    )
  }
}

module.exports = {
  saveContribution
}
