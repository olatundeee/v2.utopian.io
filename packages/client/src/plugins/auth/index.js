import jwt from 'jsonwebtoken'
import { Cookies } from 'quasar'
import gitHubLogin from './providers/github'
import linkSteemAccount from './blockchains/steem'

/**
 * Manages the authentication and linking blockchain accounts
 * Authentication and utopian account creation is handled first if needed
 * Then we load the access token to have access tp authenticated endpoints
 * We handle callbacks that requires an account
 *
 * @param currentRoute
 * @param store
 * @param redirect
 * @param ssrContext
 * @returns {Promise<void>}
 */
export default async ({ currentRoute, store, redirect, ssrContext }) => {
  const cookies = process.env.SERVER ? Cookies.parseSSR(ssrContext) : Cookies

  // Login with any external provider
  const state = currentRoute.query.state
  let loginState = state
  let extraParemeter = ''

  if (loginState && loginState.split('githublogin').length > 1) {
    extraParemeter = loginState.split('githublogin:')[1]
    loginState = 'githublogin'
  }
  
  if (loginState === 'githublogin') {
    await gitHubLogin({ currentRoute, store, redirect, ssrContext })
  } else {
    // Prepare the tokens to enable authenticated calls to the API
    if (cookies.get('access_token')) {
      await store.dispatch('api/setTokens', {
        accessToken: cookies.get('access_token'),
        refreshToken: cookies.get('refresh_token')
      })
    }
  }

  // Link blockchain accounts
  if (loginState === 'steemconnectlogin') {
    await linkSteemAccount({ currentRoute, store })
  }
  console.log(currentRoute)
  // state = 'redirect=${githubLink}
  if (extraParemeter && currentRoute.path === '/') {
    redirect(extraParemeter)
  }

  // state = 'redirect=${githubLink}
  if (extraParemeter) {
    redirect(extraParemeter)
  }

  // Load the user information
  if (cookies.get('access_token')) {
    const token = jwt.decode(cookies.get('access_token'))
    if (token.scopes.includes('app')) {
      await store.dispatch('auth/me')
    }
  }
}
