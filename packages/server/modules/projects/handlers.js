const crypto = require('crypto')
const Boom = require('boom')
const Slugify = require('slugify')
const Project = require('./project.model')
const User = require('../users/user.model')
const { getUserProjectPermission } = require('../../utils/github')
const { sanitizeHtml } = require('../../utils/html-sanitizer')

const getProjects = async (req, h) => {
  const { q } = req.payload

  const reg = new RegExp(q, 'i')
  const projects = await Project.find({ $or: [{ $text: { $search: q } }, { name: { $regex: reg }, blacklisted: false, status: 'active' }] }).select('images tags slug createdAt creator description details name platforms website license docs -_id')
  return h.response({ data: projects })
}

const getProjectBySlug = async (req, h) => {
  const project = await Project.findOne({ slug: req.params.slug }).select('images slug tags createdAt creator description details name platforms website license docs -_id')
  return h.response({ data: project })
}

const getFeaturedProjects = async (req, h) => {
  const projects = await Project.find({ featured: true, blacklisted: false }).select('images tags createdAt creator description details name platforms website license docs featured_order slug -_id').sort({ featured_order: 1 })
  return h.response({ data: projects })
}

const deleteProjectBySlug = async (req, h) => {
  // TODO Only creator should be able to delete a project
  const response = await Project.updateOne({ slug: req.params.slug }, { $set: { status: 'deleted', deletedAt: Date.now() } })
  if (response.n === 1) {
    return h.response({ message: 'delete-success' })
  }

  throw Boom.badData('document-does-not-exist')
}

const editProjectBySlug = async (req, h) => {
  const response = await Project.updateOne({ slug: req.params.slug }, req.payload)
  if (response.n === 1) {
    return h.response({ message: 'update-success' })
  }

  throw Boom.badData('document-does-not-exist')
}

const saveProject = async (req, h) => {
  const creator = req.auth.credentials.username

  // A user can't have two projects with the same name
  const projectName = await Project.findOne({ creator, name: req.payload.name })
  if (projectName) {
    throw Boom.badData('project-exists')
  }

  // Check for existing slug
  const slugs = []
  let slug = Slugify(`${creator}-${req.payload.name}`)
  const projectSlug = await Project.countDocuments({ slugs: { $all: [slug] } })
  if (projectSlug > 0) {
    slug += crypto.randomBytes(5).toString('hex')
  }

  slugs.push(slug)

  // Filter the repositories where the user has admin rights
  const user = await User.findOne({ username: creator })
  const provider = user.authProviders.find((p) => p.type === req.payload.type)
  const repositories = req.payload.repositories.filter(async (repo) => {
    if (repo.type === 'github') {
      const [owner, name] = repo.label.split('/')
      const permission = await getUserProjectPermission({
        token: provider.token,
        owner,
        name
      })
      return permission.toString().toUpperCase() === 'ADMIN'
    }

    return false
  })
  if (repositories.length === 0) {
    throw Boom.badData('project-no-repositories')
  }

  const newProject = new Project({
    repositories,
    creator,
    slugs,
    details: sanitizeHtml(req.payload.details),
    ...req.payload
  })

  const data = await newProject.save()

  return h.response({ data })
}

const isNameAvailable = async (req, h) => {
  const creator = req.auth.credentials.username
  return h.response({ data: await Project.countDocuments({ creator, name: req.payload.name }) === 0 })
}

const isProjectAdmin = async (req, h) => {
  const user = await User.findOne({ username: req.auth.credentials.username })
  const provider = user.authProviders.find((p) => p.type === req.payload.type)
  if (provider && provider.token) {
    if (provider.type === 'github') {
      const [owner, name] = req.payload.project.split('/')
      const permission = await getUserProjectPermission({
        token: provider.token,
        owner,
        name
      })
      return h.response({ data: permission.toString().toUpperCase() === 'ADMIN' })
    }
  }

  return h.response({ data: false })
}

module.exports = {
  getProjects,
  saveProject,
  getProjectBySlug,
  deleteProjectBySlug,
  editProjectBySlug,
  getFeaturedProjects,
  isNameAvailable,
  isProjectAdmin
}
