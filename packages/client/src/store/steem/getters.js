import * as _ from 'lodash'

export const rewardFund = ({ rewardFund }) => rewardFund
export const dynamicProperties = ({ dynamicProperties }) => dynamicProperties
export const feedPrice = ({ feedPrice }) => feedPrice
export const recentClaims = ({ rewardFund }) => _.get(rewardFund, 'recent_claims', 0)
export const rewardBalance = ({ rewardFund }) => _.get(rewardFund, 'reward_balance', 0)
export const baseFeedPrice = ({ feedPrice }) => _.get(feedPrice, 'base', 0)
export const userDetails = ({ userDetails }) => userDetails
export const steemUser = ({ userDetails }) => _.get(userDetails, 'name', null)
