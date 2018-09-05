// import lodash helpers.
import * as _ from 'lodash'
import { slugify } from 'src/services/common/string'
// base metadata fields.
export const baseMetadata = {
  app: 'utopian/2.0',
  format: 'markdown'
}

// metadata generator.
export const generateMetadata = (meta, tags) => _.merge(_.merge(baseMetadata, { utopian: meta }), { tags })

export const generateOperations = (author, title, permlink = null, body = '', jsonMetadata = {}) => {
  // build comment data.
  let commentData = {
    parent_author: '',
    parent_permlink: 'utopian-io',
    author: author,
    permlink: permlink,
    title: title,
    body: body,
    json_metadata: JSON.stringify(jsonMetadata)
  }
  // build comment operation array.
  const comment = ['comment', commentData]

  // get the beneficiary account name and percent.
  // defaults to the author.
  const beneficiaryAccount = _.get(process.env, 'BENEFICIARY_ACCOUNT', author)
  const beneficiaryPercent = _.toNumber(_.get(process.env, 'BENEFICIARY_PERCENT', '500'))

  // build the beneficiaries array.
  const beneficiaries = [
    { account: beneficiaryAccount, weight: beneficiaryPercent }
  ]

  // build comment options data array.
  const commentOptionsData = {
    author: author,
    permlink: permlink,
    allow_votes: true,
    max_accepted_payout: '1000000.000 SBD',
    percent_steem_dollars: 10000,
    allow_curation_rewards: true,
    extensions: [
      [0, { beneficiaries: beneficiaries }]
    ]
  }

  // build comment options operation.
  const commentOptions = ['comment_options', commentOptionsData]

  // return both operations to be broadcast at once.
  return [comment, commentOptions]
  // return this.broadcast([['comment', params]], cb);
}

export const generateUpdateOperations = (author, title, permlink = null, body = '', jsonMetadata = {}) => {
  // build comment data.
  let commentData = {
    parent_author: '',
    parent_permlink: 'utopian-io',
    author: author,
    permlink: permlink,
    title: title,
    body: body,
    json_metadata: JSON.stringify(jsonMetadata)
  }
  // build comment operation array.
  const comment = ['comment', commentData]

  // return both operations to be broadcast at once.
  return [comment]
}

// title slug.
export const slugifyTitle = (title) => slugify(title)
