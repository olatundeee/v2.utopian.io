import * as _ from 'lodash'
import { client as baseClient } from 'src/services/steem/connect/client'

// prepare a steem-connect client instance to broadcast something.
// this method is intended to not persist the token on steem-connect sdk.
// meaning the token must be decrypted on every usage.
export const prepareClient = ({ dispatch }) => {
  return dispatch('auth/getCredential', 'steem', { root: true })
    .then(encryptedToken => {
      const token = _.get(encryptedToken, 'secret', null)
      if (token) {
        return dispatch('decrypt', token, { root: true })
          .then((token) => {
            const client = _.clone(baseClient)
            client.setAccessToken(token)
            return client
          })
      }
      return Promise.reject(new Error('no steem credentials'))
    })
}
