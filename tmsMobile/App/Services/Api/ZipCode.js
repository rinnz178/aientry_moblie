import api from './Api';

export default function ZipCode(zipCode) {
  return new Promise((resolve, reject) => {
    api(`/api/zipcode?zipcode=${zipCode}`, 'GET', false)
      .then((response) => {
        if (!response.ok) { throw response; }
        return response.json();
      })
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
}
