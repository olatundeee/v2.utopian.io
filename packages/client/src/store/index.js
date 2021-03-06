// import vue and vuex.
import Vue from 'vue'
import Vuex from 'vuex'

// import root store components.
import state from './state'
import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'

// import store modules.
import api from './api'
import common from './common'
import auth from './auth'
import steem from './steem'
import project from './project'
import projects from './projects'
import users from './users'
import contributions from './contributions'
import github from './github'
import blockchainSteem from './blockchains/steem'
import utils from './utils'

// join modules.
const modules = {
  api,
  common,
  auth,
  blockchainSteem,
  steem,
  project,
  projects,
  users,
  contributions,
  github,
  utils
}

// enable vuex.
Vue.use(Vuex)

export default function () {
  const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
    modules
  })

  return store
}
