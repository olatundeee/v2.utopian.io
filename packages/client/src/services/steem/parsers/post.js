// imports.
import * as _ from 'lodash'
import { categories, tasks } from 'src/services/utopian/categories'
import { parseCurrencyString } from 'src/services/currencies/formatter'
import { formatReputation } from 'src/services/steem/account'
import moment from 'moment'

// const bypass = (v) => v
const getValue = (post, field, otherwise = null, transform = null) => {
  const value = _.get(post, field, otherwise)

  return (transform !== null) ? transform(value) : value
}

// post parser.
export const parsePost = (post) => {
  // parse metadata.
  post._meta = getValue(post, 'json_metadata', {})

  // parse tags.
  post._tags = getValue(post, '_meta.tags', [])
  post._image = getValue(post, '_meta.image', [])

  // parse category.
  post._category = getValue(post, '_meta.utopian.category', '')

  // parse task-category
  post._task = find(post._tags, (tag) => tasks.includes(tag))

  // parse a tag list on format object.
  post._tags_list = _.map(post._tags, tagString => ({ id: tagString, label: tagString }))

  // visible post tags.
  post._visible_tags = _.filter(post._tags_list, (tag) => {
    return (tag.label !== 'utopian-io') && (categories.indexOf(tag.label) === -1) && (!tasks.includes(tag.label))
  })

  // pending payout.
  post._pending_payout_value = parseCurrencyString(_.get(post, 'pending_payout_value', '0'))

  // moment object for the time created (UTC).
  post._time_created = moment.utc(_.get(post, 'created', null))

  // diff string
  post._time_created_from_now = post._time_created.fromNow()

  // net votes, force integer.
  post._net_votes = parseInt(_.get(post, 'net_votes'))

  // voters list.
  post._voters = _.map(_.get(post, 'active_votes'), (vote) => _.get(vote, 'voter'))

  // normalize a reply key.
  post._net_replies = parseInt(_.get(post, 'children'))

  post._max_accepted_payout = parseFloat(_.get(post, 'max_accepted_payout', 0))
  post._payout_declined = (post._max_accepted_payout <= 0)
  post._pending_payout_value = parseFloat(_.get(post, 'pending_payout_value', 0))
  post._pending_payout_value = parseFloat(_.get(post, 'pending_payout_value', 0))
  post._promoted = parseFloat(_.get(post, 'promoted', 0))
  post._total_payout_value = parseFloat(_.get(post, 'total_payout_value', 0))
  post._author_payout_value = post._total_payout_value
  post._curator_payout_value = parseFloat(_.get(post, 'curator_payout_value', 0))
  post._payout_value = post._total_payout_value + post._pending_payout_value
  // avatar helper.
  post._author_avatar = 'https://steemitimages.com/u/' + _.get(post, 'author') + '/avatar'
  post._paid = _.get(post, 'cashout_time', '')
  // parsed author reputation.
  post._author_reputation = formatReputation(_.get(post, 'author_reputation'))

  // return the post.
  return post
}
