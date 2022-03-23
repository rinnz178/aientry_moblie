import { PureComponent } from 'react';
import {
  PermissionsAndroid, Alert, Linking, ToastAndroid, Platform
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import setUserLocation from './Store/actions';
import trans from '../../Translations/Trans';


class GeoLocationManager extends PureComponent {
  async componentDidMount() {
    const { setUserPosition } = this.props;

    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) {
      return;
    }
    this.setGeolocationConfig();
    Geolocation.watchPosition(
      (position) => {
        setUserPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          altitude: position.coords.altitude
        });
      },
      (error) => {
        /* eslint-disable */
        error.code === 1 ? Alert.alert(trans(`locationErrorCode${error.code}`)) : console.log(error.code);
        /* eslint-enable */
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10,
        interval: 5000,
        fastestInterval: 2000,
        forceRequestLocation: true
      },
    );
  }

  componentWillUnmount() {
    Geolocation.stopObserving();
  }

  hasLocationPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      Alert.alert(trans('locationErrorCode1'));
    }

    if (status === 'disabled') {
      Alert.alert(
        'Turn on Location Services to allow "AI-Entry" to determine your location.',
        '',
        [
          { text: 'Go to Settings', onPress: openSetting },
          { text: "Don't Use Location", onPress: () => {} },
        ],
      );
    }

    return false;
  };

  hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await this.hasLocationPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        trans('locationErrorCode1'),
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };

  getLocation = () => new Promise(((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => { resolve(position); },
      (error) => { reject(error.code); },
      { enableHighAccuracy: true, timeout: 2000, maximumAge: 0 }
    );
  }))

  setGeolocationConfig = () => {
    Geolocation.setRNConfiguration({
      skipPermissionRequests: false,
      authorizationLevel: 'whenInUse'
    });
  }

  render() {
    return null;
  }
}

const mapDispatchToProps = dispatch => ({
  setUserPosition: position => dispatch(setUserLocation(position))
});

export default connect(null, mapDispatchToProps,)(withNavigation(GeoLocationManager));
