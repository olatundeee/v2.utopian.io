// imports.
import axios from 'axios'
import * as _ from 'lodash'

// create an axios instance.
export const http = axios.create()

// flatten success responses body.
const flattenSuccess = response => _.get(response, 'data', {})

// flatten error responses body.
const flattenError = error => Promise.reject(_.get(error, 'response.data', {}))

// export plugin.
export default ({ Vue }) => {
  // success and error interceptors.
  http.interceptors.response.use(flattenSuccess, flattenError)
  // expose the $axios instance as $axios on components.
  Vue.prototype.$axios = http
  // expose the $http instance as $axios on components.
  Vue.prototype.$http = http
}
