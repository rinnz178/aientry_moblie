import { PureComponent } from 'react';
import Config from 'react-native-config';
import { Storage } from '../Services';

class AuthenticateUser extends PureComponent {
  componentDidMount() {
    this._authenticate();
  }

  _authenticate = async () => {
    const { navigation } = this.props;
    const userToken = await Storage.getData(Config.ACCESS_TOKEN);
    navigation.navigate(userToken ? 'App' : 'Auth');
  };

  render() {
    return null;
  }
}

export default AuthenticateUser;
