// imports.
import { api } from 'src/services/steem/client'
import { promisify } from 'src/services/common/promisify'
import { parsePost } from './parsers/post'
import * as _ from 'lodash'
// import { parseAsHtml } from 'src/services/steem/parsers/markdown'

const fixUsername = (author) => {
  return author.replace('@', '')
}

// retrieve a post content.
export const getContent = (author, permlink) => {
  return api.getContentAsync(fixUsername(author), permlink).then(parsePost)
}

const arrayToObject = (values) => {
  const result = {}

  _.each(values, v => {
    result[v] = v
  })

  return result
}

export const nestComments = (comments, post) => {
  return _.mapValues(arrayToObject(post.replies), (replyPermlink) => {
    const reply = _.get(comments, replyPermlink)
    reply._replies = nestComments(comments, reply)
    return reply
  })
}

// const parseMarkdown = (post) => {
//   post._body = parseAsHtml(post.body)
//
//   return post
// }

export const getState = (author, permlink) => {
  return api.getStateAsync('utopian-io/' + author + '/' + permlink).then((response) => {
    const comments = _.mapValues(response.content, parsePost)
    response.content = _.mapValues(comments, (v) => v)
    response.post = _.get(response.content, fixUsername(author) + '/' + permlink)
    response._replies = nestComments(comments, response.post)
    return response
  })
}

// get content replies.
export const getReplies = (author, permlink) => {
  return api.getContentRepliesAsync(fixUsername(author), permlink)
}

// retrieve posts on generic method.
export const getBy = (method, query) => {
  const promiseGetter = promisify(method)

  return promiseGetter(query).then((posts) => _.map(posts, parsePost))
}

// load posts by created order.
export const byCreated = (query) => {
  return getBy(api.getDiscussionsByCreated, query)
}

// load posts by trending order.
export const byTrending = (query) => {
  return getBy(api.getDiscussionsByTrending, query)
}

// initial / buggy pagination.
export const byOrder = (order = 'trending', query, last = null) => {
  const getQuery = Object.assign({}, query)

  if (last) {
    getQuery['start_author'] = _.get(last, 'author')
    getQuery['start_permlink'] = _.get(last, 'permlink')
    getQuery['limit'] = _.get(query, 'limit', 10) + 1
  }

  const method = order === 'trending' ? byTrending : byCreated

  return method(getQuery).then(results => {
    if (last) {
      results.shift()
    }
    return results
  })
}

export const byAuthor = ({ author, startPermlink = '', beforeDate = new Date().toJSON().substr(0, 19), limit = 20 }) => {
  return api.getDiscussionsByAuthorBeforeDateAsync(author, startPermlink, beforeDate, limit).then((posts) => _.map(posts, parsePost))
}

// default export.
export default {
  byCreated,
  byTrending,
  byOrder,
  byAuthor
}
