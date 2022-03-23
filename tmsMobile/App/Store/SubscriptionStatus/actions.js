import SUBSCRIPTION_STATUS from './action-types';

const setSubscriptionStatus = payload => ({
  type: SUBSCRIPTION_STATUS,
  payload
});

export default setSubscriptionStatus;
