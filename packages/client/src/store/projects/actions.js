import API from 'src/plugins/api'

export const getFeaturedProjects = async (context) => {
  const payload = await API.call({
    context,
    method: 'get',
    url: '/v1/projects/featured'
  })
  context.commit('setFeaturedProjects', payload)
}

export const isNameAvailable = async (context, name) =>
  API.call({
    context,
    method: 'post',
    url: `/v1/projects/isnameavailable`,
    data: {
      name
    }
  })

export const saveProject = async (context, data) => {
  return API.call({
    context,
    method: 'post',
    url: '/v1/project',
    data
  })
}
