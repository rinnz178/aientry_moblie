import api from './Api';

/**
 * No Face Required.
 * API for normal time in / time out attendance.
 *
 * @param {int} id - site id
 * @param {Object} location - device's latitude and longitude
 * @param {string} status - actions ('in' or 'out')
 */
export function attendance(id, location, status) {
  const params = {
    site_user_id: id,
    latitude: location.latitude,
    longitude: location.longitude,
    status
  };
  return new Promise((resolve, reject) => {
    api('/api/attendances/record', 'POST', true, params)
      .then((response) => {
        if (!response.ok) { throw response; }
        return response.json();
      })
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
}

export function attendanceWithFaceRecognition(image, id, location, status) {
  const params = {
    image,
    site_user_id: id,
    latitude: location.latitude,
    longitude: location.longitude,
    status
  };
  return new Promise((resolve, reject) => {
    api('/api/attendances/face-recognition', 'POST', true, params)
      .then((response) => {
        if (!response.ok) { throw response; }
        return response.json();
      })
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
}
