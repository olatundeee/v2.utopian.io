// imports.
import { api } from 'src/services/steem/client'
import { parseRewardFund } from './parsers/common/reward-fund'
import * as _ from 'lodash'

// reward fund getter.
export const getRewardFund = _.memoize(() => api.getRewardFundAsync('post').then(parseRewardFund))

// dynamic global properties getter.
export const getDynamicGlobalProperties = _.memoize(() => api.getDynamicGlobalPropertiesAsync())

// current median history price getter.
export const getMedianFeedPrice = _.memoize(() => api.getCurrentMedianHistoryPriceAsync())
