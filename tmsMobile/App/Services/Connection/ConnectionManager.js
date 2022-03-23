import { PureComponent } from 'react';
import NetInfo from '@react-native-community/netinfo';

class ConnectionManager extends PureComponent {
  constructor() {
    super();
    this.handleConnectivityChange = this.handleConnectivityChange.bind(this);
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  handleConnectivityChange = (isConnected) => {
    const { connection } = this.props;
    connection(isConnected);
  };

  render() {
    return null;
  }
}

export default ConnectionManager;
