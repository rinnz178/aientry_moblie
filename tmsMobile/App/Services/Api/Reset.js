
import api from './Api';

export default function Reset(email) {
  const details = {
    email,
  };

  return new Promise((resolve, reject) => {
    api('/api/password/create', 'POST', false, details)
      .then((response) => {
        if (!response.ok) { throw response; }
        return response.json();
      })
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
}
