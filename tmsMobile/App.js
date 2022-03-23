import React, { PureComponent } from 'react';
import {
  View, Linking, Alert, StyleSheet
} from 'react-native';
import WebView from 'react-native-webview';
import Config from 'react-native-config';
import { Provider as StoreProvider } from 'react-redux';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import SplashScreen from 'react-native-splash-screen';
import { PersistGate } from 'redux-persist/es/integration/react';
import { ConnectionManager, Storage } from './App/Services';
import { checkPermission, createNotificationChannel } from './App/Services/Notification/FirebaseNotification';
import AppNavigation from './App/Navigation/AppNavigation';
import {
  StatusBar, Modal, ModalContainer, Button, CustomIcon, OfflineNotice
} from './App/Components';
import UserGuide from './App/Containers/UserGuide/UserGuide';
import { store, persistedStore } from './App/Store';

export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      isConnected: true,
      url: '',
    };
    this.displayUserGuide();
    this.showResetModal = this.showResetModal.bind(this);
  }

  componentDidMount() {
    SplashScreen.hide();
    Linking.getInitialURL().then((url) => {
      if (url) {
        this.updateModalState(url);
      }
    }).catch(err => Alert.alert('An error occurred', err.toString()));

    Linking.addEventListener('url', this.handleOpenURL);

    // Firebase notification setup channel and permission
    createNotificationChannel();
    checkPermission();
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURL);
  }

  handleOpenURL = (event) => {
    this.updateModalState(event.url);
  }

  updateModalState = (url) => {
    if (url) {
      this.setState({ showModal: true, url });
    }
  }

  handleConnectionState = (isConnected) => {
    this.setState({ isConnected });
  };

  /**
   *  Displays user guide at first open of the application,
   *  will check the Local Storage if user has completed the guide.
   *  returns '1' if true or completed
   *  null if not yet.
   */
  displayUserGuide = async () => {
    const isGuideComplete = await Storage.getData(Config.USER_GUIDE);
    let showApp = false;
    isGuideComplete === '1' && (showApp = true);
    this.setState({ showApp });
  }

  showResetModal() {
    const { showModal } = this.state;
    this.setState({
      showModal: !showModal
    });
  }

  render() {
    const {
      showModal, url, isConnected, showApp
    } = this.state;
    if (showApp) {
      return (
        <StoreProvider store={store}>
          <PersistGate persistor={persistedStore}>
            <View style={styles.application}>
              <ConnectionManager connection={this.handleConnectionState} />
              { // will render if there is no internet connection
                !isConnected
                && (
                  <OfflineNotice hasConnection={isConnected} />
                )
              }
              <StatusBar hideStatusBar={false} translucent backgroundColor="transparent" />
              <Modal
                customStyle={styles.modalStyle}
                visible={showModal}
                onBackdropPress={this.showResetModal}
                onSwipeComplete={this.showResetModal}
              >
                <ModalContainer height="90%">
                  <View style={styles.actionView}>
                    <Button style={styles.closeButton} onPress={this.showResetModal}>
                      <CustomIcon name="ios-close" size={40} />
                    </Button>
                  </View>
                  <WebView
                    source={{ uri: url }}
                    onLoadProgress={({ nativeEvent }) => {
                      this.ActivityIndicatorLoadingView = nativeEvent.url;
                    }}
                    containerStyle={styles.webviewContainer}
                    startInLoadingState
                  />
                </ModalContainer>
              </Modal>
              <AppNavigation />
            </View>
          </PersistGate>
        </StoreProvider>
      );
    }
    return <UserGuide hideGuide={hideGuide => this.setState({ showApp: hideGuide })} />;
  }
}

const styles = StyleSheet.create({
  application: {
    flex: 1
  },
  modalStyle: {
    justifyContent: 'flex-end'
  },
  actionView: {
    height: responsiveHeight(5),
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeButton: {
    position: 'absolute',
    right: 10
  },
  webviewContainer: {
    width: '100%'
  }
});
