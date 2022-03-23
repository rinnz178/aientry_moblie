import api from './Api';

export default function Resend(email) {
  const body = {
    email
  };
  return new Promise((resolve, reject) => {
    api('/api/email/resend', 'POST', false, body)
      .then((response) => {
        if (!response.ok) { throw response; }
        return response.json();
      })
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
}
