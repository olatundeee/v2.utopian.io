import * as _ from 'lodash'

export const vote = async ({ getters, commit, dispatch, rootGetters }, { author, permlink, weight }) => {
  const username = _.get(rootGetters, 'steem/steemUser')
  return dispatch('prepareClient')
    .then((client) => client.vote(username, author, permlink, (weight * 100)))
}
