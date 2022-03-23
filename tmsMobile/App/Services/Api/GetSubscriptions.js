import api from './Api';

/**
 * Will get user's subscriptions from App/Play store.
 *
 * @return Object
 */
export default function getSubscription() {
  return new Promise((resolve, reject) => {
    api('/api/features/user-subscriptions', 'GET', true) // route not yet finalized.
      .then((response) => {
        if (!response.ok) { throw response; }
        return response.json();
      })
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
}
