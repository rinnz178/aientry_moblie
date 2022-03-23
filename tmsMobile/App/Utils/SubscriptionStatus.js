import { getSubscription as subscriptions } from '../Services';

const getUserSubscription = () => (
  subscriptions().then((response) => {
    if (response.data) {
      // setSubscriptionStatus(response.data);
      return response.data;
    }
    return null;
  }).catch((error) => {
    /* eslint-disable */
      console.log('Error Getting Subscriptions', error);
      /* eslint-enable */
  })
);

export default getUserSubscription;
