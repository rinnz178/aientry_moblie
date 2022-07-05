import { PureComponent } from 'react';
import NetInfo from '@react-native-community/netinfo';

class ConnectionManager extends PureComponent {
  constructor() {
    super();
    this.handleConnectivityChange = this.handleConnectivityChange.bind(this);
  }

  componentDidMount() {
    this.netInfo = NetInfo.addEventListener(this.handleConnectivityChange);
  }

  componentWillUnmount() {
    this.netInfo && this.netInfo();
  }

  handleConnectivityChange = (state) => {
    const { isConnected } = state;
    const { connection } = this.props;
    connection(isConnected);
  };

  render() {
    return null;
  }
}

export default ConnectionManager;
