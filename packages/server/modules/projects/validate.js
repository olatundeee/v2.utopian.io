const Joi = require('joi')
const { licenses } = require('../../utils/constants')

const getProjectBySlug = {
  params: {
    slug: Joi.string().trim().required()
  }
}

const deleteProjectBySlug = {
  params: {
    slug: Joi.string().trim().required()
  }
}

const getProjects = {
  payload: {
    q: Joi.string().trim().required()
  }
}

const saveProject = {
  payload: {
    name: Joi.string().trim().required(),
    repositories: Joi.array().unique().required(),
    website: Joi.string().trim().uri(),
    docs: Joi.string().trim().uri(),
    license: Joi.string().trim().allow(licenses),
    medias: Joi.array().required(),
    description: Joi.string().trim().required(),
    details: Joi.string().trim().required(),
    tags: Joi.array().min(3).unique().items(Joi.string().trim().alphanum()).required()
  }
}

const editProjectBySlug = {
  payload: {
    name: Joi.string().trim().required(),
    repositories: Joi.array().unique().required(),
    website: Joi.string().trim().uri(),
    docs: Joi.string().trim().uri(),
    license: Joi.string().trim().allow(licenses),
    medias: Joi.array().required(),
    description: Joi.string().trim().required(),
    details: Joi.string().trim().required(),
    tags: Joi.array().min(3).unique().items(Joi.string().trim().alphanum()).required()
  }
}

const isNameAvailable = {
  payload: {
    name: Joi.string().trim().required()
  }
}

const isProjectAdmin = {
  payload: {
    project: Joi.string().trim().required(),
    type: Joi.string().trim().required()
  }
}

module.exports = {
  saveProject,
  editProjectBySlug,
  getProjectBySlug,
  deleteProjectBySlug,
  getProjects,
  isNameAvailable,
  isProjectAdmin
}
