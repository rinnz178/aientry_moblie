import Config from 'react-native-config';
import Storage from '../LocalStorage/Storage';

/**
 * @param {string} url - API route Ex: /api/profile
 * @param {string} method - HTTP methods Ex: POST, GET
 * @param {boolean} isPrivate - Set true if the API needs an access token
 * @param {Object} params - Request Body (nullable)
 */
const api = async (url, method, isPrivate, params = null, isFormData = null) => {
  const accessToken = await Storage.getData(Config.ACCESS_TOKEN);
  const defaultHeader = { Accept: 'application/json', 'Content-Type': 'application/json' };
  const formDataHeader = { Accept: 'multipart/form-data', 'Content-Type': 'multipart/form-data' };
  const headerChecker = isFormData ? formDataHeader : defaultHeader;
  const headers = (isPrivate) ? { ...headerChecker, Authorization: `Bearer ${accessToken}` } : defaultHeader;
  let options = { method, headers };

  if (params != null) {
    if (isFormData) {
      options = { ...options, body: params };
    } else {
      options = { ...options, body: JSON.stringify(params) };
    }
  }

  return fetch(
    `${Config.BASE_URL}${url}`,
    options
  );
};

export default api;
