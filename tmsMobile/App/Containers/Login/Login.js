import React, { PureComponent } from 'react';
import {
  View, Text, Keyboard, Image, BackHandler,
  Animated, StatusBar, Dimensions, Easing,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import Config from 'react-native-config';
import Toast from 'react-native-tiny-toast';
import styles from './AuthCommonStyle';
import {
  Storage, FetchOauth, reset, ResendVerification
} from '../../Services';
import {
  Button, Form, CustomDialog, PdfViewer
} from '../../Components';
import trans from '../../Translations/Trans';
import imageLogo from '../../Images/logo.png';
import checkIcon from '../../Images/icon_checkmark.png';
import infoIcon from '../../Images/icon_info.png';
import VerifyEmailDialog from './Components/VerifyEmailDialog';

const { width } = Dimensions.get('window');

class Login extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      showButtonSpinner: false,
      showAlertDialog: false,
      verificationDialog: false,
      isResetFormActive: false,
      dialogImageIcon: checkIcon,
      dialogMessage: '',
      loginValue: new Animated.Value(0),
      resetValue: new Animated.Value(0),
      webviewVisible: false,
      url: '',
    };

    this.resetPassword = this.resetPassword.bind(this);
    this.login = this.login.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
  }

  backAction = () => {
    const { isResetFormActive } = this.state;

    if (isResetFormActive) {
      this.switchForm(true);
    } else {
      BackHandler.exitApp();
    }
    return true;
  }

  storeToken = async (accessToken, refreshToken) => {
    await Storage.storeData(Config.ACCESS_TOKEN, accessToken);
    await Storage.storeData(Config.REFRESH_TOKEN, refreshToken);
  }

  /**
   * @param {Boolean} showResetForm
   * true - display Reset Form
   * false - display Login Form
   */
  switchForm = (showResetForm) => {
    const { loginValue, resetValue } = this.state;
    this.setState({
      isResetFormActive: !showResetForm
    });
    this.removeFieldState();
    Animated.timing(loginValue, {
      toValue: showResetForm ? 0 : width,
      duration: 150,
      easing: Easing.linear
    }).start();
    Animated.timing(resetValue, {
      toValue: showResetForm ? width : -width,
      duration: 150,
      easing: Easing.linear
    }).start();
  }

  /**
   * Reset fields.
   * @return void
   */
  removeFieldState = () => {
    this.setState({ username: '', password: '' });
  }

  /**
   * Call oauth token API.
   * @return void
   */
  login = () => {
    const vm = this;
    const { username, password } = vm.state;
    const { navigation } = vm.props;

    Keyboard.dismiss();
    if (username === '' || password === '') {
      vm.handleDialog(trans('emptyField'));
    } else {
      this.handleButtonSpinner();
      FetchOauth(username, password)
        .then((response) => {
          this.handleButtonSpinner();
          /* eslint-disable */
          const { access_token, refresh_token } = response;
          /* eslint-enable */
          vm.storeToken(access_token, refresh_token);
          navigation.navigate('App');
        }).catch((error) => {
          this.handleButtonSpinner();
          if (!error.status) { // server error
            vm.handleDialog(trans('networkRequestFailed'));
            return;
          }
          error.text().then((response) => {
            const err = JSON.parse(response);
            if (err.message === 'Email has not been verified.') { // unverified email
              vm.setState({ verificationDialog: true });
            } else if (err.message === 'Invalid User Device Id.') {
              // show dialog and its corresponding error message
              vm.handleDialog(trans('invalidId'));
            } else {
              // show dialog and its corresponding error message
              vm.handleDialog(trans('unauthorized'));
            }
          });
        });
    }
  }

  /**
   * [Show / Hide] Button Spinner.
   * @return void
   */
  handleButtonSpinner = () => {
    this.setState(prevState => ({
      showButtonSpinner: !prevState.showButtonSpinner
    }));
  }

  /**
   * Reset Password.
   * @return void
   */
  resetPassword = () => {
    const vm = this;
    const { username } = vm.state;

    Keyboard.dismiss();
    if (username === '') {
      vm.handleDialog(trans('emptyField'));
    } else {
      vm.setState({ showButtonSpinner: true });
      reset(username)
        .then(() => {
          vm.handleDialog(trans('successResetMessage'));
        }).catch((error) => {
          let message = trans('networkFailed');
          if (error.status === 422) {
            message = trans('emailDoesNotExist');
          }
          // show dialog and its corresponding error message
          vm.handleDialog(message);
        });
    }
  }

  /**
   * Sends a new verification link.
   * @param {String} username User email
   * @return void
   */
  resendVerification = (username) => {
    const vm = this;
    this.setState({ showButtonSpinner: true });
    ResendVerification(username)
      .then(() => {
        vm.setState({
          showButtonSpinner: false,
          verificationDialog: false,
        }, () => Toast.showSuccess(trans('emailVerificationSent'), {
          containerStyle: styles.toastSuccess,
        }));
      }).catch((error) => {
        if (!error.status) { // server error
          vm.handleDialog(trans('networkRequestFailed'));
          return;
        }
        error.text().then((response) => {
          const err = JSON.parse(response);
          vm.handleDialog(trans(err.error));
        });
      });
  }

  showWebModal = (url) => {
    const { webviewVisible } = this.state;
    this.setState({
      webviewVisible: !webviewVisible,
      url,
    });
  }

  /**
   * Alert Dialog
   * @param {String} message Dynamic message dialog
   * @return void
   */
  handleDialog(message = null) {
    const icon = message === trans('successResetMessage') ? checkIcon : infoIcon;
    this.setState(prevState => ({
      showAlertDialog: !prevState.showAlertDialog,
      dialogMessage: message || prevState.dialogMessage,
      dialogImageIcon: icon,
      showButtonSpinner: false
    }));
  }

  render() {
    const {
      username, password, loginValue, resetValue, showAlertDialog,
      dialogMessage, dialogImageIcon, verificationDialog, showButtonSpinner,
      webviewVisible, url
    } = this.state;

    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
        <View style={styles.logoContainer}>
          <Image source={imageLogo} style={styles.logoStyle} />
        </View>
        <View style={styles.formsWrapper}>
          <Animated.View style={[styles.animatedView, { right: loginValue }]}>
            <Form // Login Form
              style={styles.formContainer}
              userOnChangeText={(Username) => { this.setState({ username: Username }); }}
              buttonText={!showButtonSpinner ? trans('login') : null}
              showPasswordToggle
              hideConfirmPassword
              onLoad={showButtonSpinner}
              passwordOnChangeText={(Password) => { this.setState({ password: Password }); }}
              usernameValue={username}
              passwordValue={password}
              onSubmit={this.login}
            />
            <Button
              onPress={() => this.switchForm(false)}
              style={styles.navigatorTextButton}
            >
              <Text style={styles.grayText}>{trans('forgotYourText')}</Text>
              <Text style={styles.passwordText}>{trans('forgotPasswordText')}</Text>
            </Button>
            <Button
              onPress={() => navigation.navigate('Register1')}
              style={styles.navigatorTextButton}
            >
              <Text style={styles.passwordText}>{trans('registerAdminAccount')}</Text>
            </Button>
            <View style={styles.navigatorTextButton}>
              <Button
                onPress={() => this.showWebModal(Config.LICENSE_AGREEMENT)}
              >
                <Text style={styles.webviewText}>{trans('licenseAgreement')}</Text>
              </Button>
              <Text style={styles.grayText}> and </Text>
              <Button
                onPress={() => this.showWebModal(Config.TERMS_OF_USE)}
              >
                <Text style={styles.webviewText}>{trans('termsOfUse')}</Text>
              </Button>
            </View>
          </Animated.View>
          <Animated.View style={[styles.animatedView, { left: resetValue }]}>
            <Form // Reset Form
              style={styles.formContainer}
              hidePasswordField
              hideConfirmPassword
              onLoad={showButtonSpinner}
              userOnChangeText={(Username) => { this.setState({ username: Username }); }}
              buttonText={!showButtonSpinner ? trans('send') : null}
              usernameValue={username}
              onSubmit={this.resetPassword}
            />
            <Button
              onPress={() => this.switchForm(true)}
              style={styles.navigatorTextButton}
            >
              <Text style={styles.passwordText}>{trans('navigateLoginText')}</Text>
            </Button>
          </Animated.View>
        </View>
        <CustomDialog
          onModalWillHide={() => this.setState({ showAlertDialog: false })}
          visible={showAlertDialog}
          renderIcon={dialogImageIcon}
          title={dialogMessage}
          buttonLabel={trans('ok')}
          onPress={() => this.handleDialog()}
        />
        <VerifyEmailDialog
          visible={verificationDialog}
          onClose={() => this.setState({ verificationDialog: false })}
          username={username}
          onLoad={showButtonSpinner}
          onPress={() => this.resendVerification(username)}
        />
        <PdfViewer
          visible={webviewVisible}
          onBackButtonPress={this.showWebModal}
          onBackdropPress={this.showWebModal}
          onSwipeComplete={this.showWebModal}
          onPress={this.showWebModal}
          source={{ uri: url }}
        />
      </View>
    );
  }
}

export default withNavigation(Login);
