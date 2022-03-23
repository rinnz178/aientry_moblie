import api from './Api';

export default function profile() {
  return new Promise((resolve, reject) => {
    api('/api/profile', 'GET', true)
      .then((response) => {
        if (!response.ok) { throw response; }
        return response.json();
      })
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
}
