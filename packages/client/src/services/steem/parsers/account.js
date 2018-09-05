import * as _ from 'lodash'
import { formatReputation } from '../account'

export const parseAccount = (account) => {
  account._meta = _.attempt(() => JSON.parse(_.get(account, 'json_metadata', '{}') || '{}')) || {}
  account._about = _.get(account._meta, 'profile.about', null)
  account._name = _.get(account._meta, 'profile.name', null)
  account._location = _.get(account._meta, 'profile.location', null)
  // parsed author reputation.
  account._reputation = formatReputation(_.get(account, 'reputation'))
  return account
}
