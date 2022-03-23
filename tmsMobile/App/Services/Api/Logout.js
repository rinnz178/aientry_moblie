import api from './Api';

const Api = {
  FetchLogout() {
    return new Promise((resolve, reject) => {
      api('/api/logout', 'POST', true)
        .then((response) => {
          if (!response.ok) { throw response; }
          return response.json();
        })
        .then(response => resolve(response))
        .catch(error => reject(error));
    });
  }
};

export default Api;
