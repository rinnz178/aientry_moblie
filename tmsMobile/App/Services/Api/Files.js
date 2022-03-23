import api from './Api';

export function files() {
  return new Promise((resolve, reject) => {
    api('/api/sites', 'GET', true)
      .then((response) => {
        if (!response.ok) { throw response; }
        return response.json();
      })
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
}

/**
 * Will retrieve assigned Sites.
 *
 * @return Object.
 */
export function siteNames() {
  return new Promise((resolve, reject) => {
    api('/api/files', 'GET', true)
      .then((response) => {
        if (!response.ok) { throw response; }
        return response.json();
      })
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
}

/**
 * Will retrieve site's uploaded image/s.
 * @param {Integer} siteId
 *
 * @return Object.
 */
export function siteImages(siteId) {
  return new Promise((resolve, reject) => {
    api(`/api/files?site_id=${siteId}&is_gallery=true`, 'GET', true)
      .then((response) => {
        if (!response.ok) { throw response; }
        return response.json();
      })
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
}

/**
 * Will delete the uplaoded image/s.
 * @param {Array} imageId
 *
 * @return Object.
 */
export function deleteImages(imageId) {
  const body = {
    filesToDelete: imageId
  };
  return new Promise((resolve, reject) => {
    api('/api/files/delete', 'POST', true, body)
      .then((response) => {
        if (!response.ok) { throw response; }
        return response.json();
      })
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
}
