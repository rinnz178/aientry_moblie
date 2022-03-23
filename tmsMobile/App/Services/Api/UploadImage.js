import axios from 'axios';
import Config from 'react-native-config';
import Storage from '../LocalStorage/Storage';

/**
 * Upload Image API call using axios.
 * @param {FormData} data - images to be uploaded
 * @param {Function} callBackUploadProgress - callback function for onUploadProgress
 * @param {Function} callbackCancelToken - callback function for cancelToken
 */
export default async function uploadImage(data, callBackUploadProgress, callbackCancelToken) {
  const accessToken = await Storage.getData(Config.ACCESS_TOKEN);
  const { CancelToken } = axios;
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: `${Config.BASE_URL}/api/file/upload`,
      data,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json'
      },
      onUploadProgress(progressEvent) {
        callBackUploadProgress(progressEvent);
      },
      cancelToken: new CancelToken(((c) => {
        callbackCancelToken(c);
      }))
    })
      .then((response) => {
        if (response.status !== 200) { throw response; }
        return response;
      })
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
}
