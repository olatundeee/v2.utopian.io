// imports.
import * as _ from 'lodash'
import { Platform } from 'quasar'

// common store getters.

// mobile or not.
export const isMobile = () => _.get(Platform, 'is.mobile', false)
// desktop or not.
export const isDesktop = () => _.get(Platform, 'is.desktop', false)
