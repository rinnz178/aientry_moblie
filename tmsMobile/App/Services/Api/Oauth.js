import Config from 'react-native-config';
import DeviceInfo from 'react-native-device-info';
import api from './Api';

export default function FetchOauth(username, password) {
  const deviceID = DeviceInfo.getUniqueId().toUpperCase();
  const details = {
    grant_type: Config.GRANT_TYPE,
    client_id: Config.CLIENT_ID,
    client_secret: Config.CLIENT_SECRET,
    username,
    password,
    scope: Config.SCOPE,
    device_id: deviceID
  };

  return new Promise((resolve, reject) => {
    api('/oauth/token', 'POST', false, details)
      .then((response) => {
        if (!response.ok) { throw response; }
        return response.json();
      })
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
}
