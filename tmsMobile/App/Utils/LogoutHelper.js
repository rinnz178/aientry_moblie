import { Alert } from 'react-native';
import Config from 'react-native-config';
import { Storage, Logout } from '../Services';
import trans from '../Translations/Trans';

export default function logoutUser(isConnected, navigation, isExpiredToken = true, deleteState) {
  const token = Config.ACCESS_TOKEN;

  if (isConnected && !isExpiredToken) {
    Logout.FetchLogout()
      .then(() => {
        Storage.removeData(token);
        deleteState();
        navigation.navigate('Auth');
      }).catch((error) => {
        console.log(error); // eslint-disable-line
      });
  } else if (!isConnected || isExpiredToken) {
    Alert.alert(
      '',
      trans('sessionExpired'),
      [
        {
          text: trans('yes'),
          onPress: () => forceLogout(token, navigation),
          style: 'destructive'
        },
      ],
      { cancelable: false },
    );
  }
}

function forceLogout(token, navigation) {
  Storage.removeData(token);
  navigation.navigate('Auth');
}
