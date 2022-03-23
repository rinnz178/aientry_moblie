import React, { PureComponent } from 'react';
import {
  View, Keyboard, Image, StatusBar, BackHandler
} from 'react-native';
import { withNavigation } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './AuthCommonStyle';
import {
  Form, CustomDialog
} from '../../Components';
import FormHeader from './Components/FormHeader';
import trans from '../../Translations/Trans';
import imageLogo from '../../Images/logo.png';
import infoIcon from '../../Images/icon_info.png';
import { CheckEmail, ConnectionManager } from '../../Services';
import ValidateEmail from '../../Utils/EmailValidator';
import FormValidator from '../../Utils/FormValidator';

class RegisterOne extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        email: '',
        password: '',
        confirmPassword: '',
      },
      showAlertDialog: false,
      showButtonSpinner: false,
      dialogMessage: '',
      isConnected: false,
    };

    this.handleDialog = this.handleDialog.bind(this);
    this.navigate = this.navigate.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
  }

  backAction = () => {
    const { navigation } = this.props;
    navigation.goBack();
    return true;
  }


  /**
   * Trap errors before navigating to Additional Form Screen.
   * @return void
   */
  navigate = () => {
    const { data } = this.state;
    const { navigation } = this.props;
    Keyboard.dismiss();
    const vm = this;

    if (vm.validateForm()) { // return if there is an error
      return;
    }

    this.setState({ showButtonSpinner: true });
    // check if email is unique
    CheckEmail(data)
      .then(() => {
        navigation.navigate('Register2', { credentials: data });
        this.setState({ showButtonSpinner: false });
      }).catch((error) => {
        if (error.status === 422) { // existing value(s)
          error.text().then((response) => {
            const err = JSON.parse(response);
            let message = '';
            // retrieve error message(s)
            Object.keys(err.errors).map(async (key) => {
              await err.errors[key].map((msg) => {
                message += `• ${trans(msg)}\n`;
                return message;
              });
              // show dialog and its corresponding error message
              vm.handleDialog(message);
            });
          });
        }

        if (error.message) { // server error
          // show dialog and its corresponding error message
          vm.handleDialog(trans('networkRequestFailed'));
        }
      });
  }

  /**
   * Checks the inputted data,
   * @return Boolean
   */
  validateForm = () => {
    const {
      data, isConnected
    } = this.state;

    let hasError = false;
    try {
      // validate empty field/s
      if (FormValidator(data)) {
        throw new Error(trans('emptyField'));
      }
      // validate email format
      if (!ValidateEmail(data.email)) {
        throw new Error(trans('invalidEmailFormat'));
      }
      // invalid password length
      if (data.password.length !== 8) {
        throw new Error(trans('passwordMustBeEightCharactersLong'));
      }
      // password does not match
      if (data.password !== data.confirmPassword) {
        throw new Error(trans('passwordsDoNotMatch'));
      }
      // trim white space and check if length is lesser than 8
      if (data.password.trim() === '' || data.password.trim().length !== 8) {
        throw new Error(trans('invalidPassword'));
      }
      // no internet connection
      if (!isConnected) {
        throw new Error(trans('noConnection'));
      }
    } catch (error) {
      // show dialog and its corresponding error message
      this.handleDialog(error.message);
      hasError = true;
    }
    return hasError;
  }

  /**
   * Internet Connection state.
   * @return void
   */
  handleConnectionState = (isConnected) => {
    this.setState({ isConnected });
  };

  /**
   * [Show / Hide ] Alert Dialog.
   * @param {String} message Dynamic message dialog
   * @return void
   */
  handleDialog(message = null) {
    this.setState(prevState => ({
      showAlertDialog: !prevState.showAlertDialog,
      dialogMessage: message || prevState.dialogMessage,
      showButtonSpinner: false
    }));
  }

  render() {
    const {
      data, showAlertDialog, dialogMessage, showButtonSpinner
    } = this.state;

    return (
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
          <ConnectionManager connection={this.handleConnectionState} />
          <View style={styles.logoContainer}>
            <Image source={imageLogo} style={styles.logoStyle} />
          </View>
          <View style={styles.formWithHeader}>
            <FormHeader title={trans('accountCredentials')} />
            <Form // Register Form
              style={styles.formContainer}
              userOnChangeText={(Email) => {
                this.setState({ data: { ...data, email: Email } });
              }}
              buttonText={!showButtonSpinner ? trans('next') : null}
              passwordOnChangeText={(Password) => {
                this.setState({ data: { ...data, password: Password } });
              }}
              confirmPasswordOnChangeText={(ConfirmPassword) => {
                this.setState({ data: { ...data, confirmPassword: ConfirmPassword } });
              }}
              emailValue={data.email}
              passwordValue={data.password}
              confirmPassValue={data.confirmPassword}
              onLoad={showButtonSpinner}
              onSubmit={this.navigate}
            />
            <CustomDialog
              visible={showAlertDialog}
              renderIcon={infoIcon}
              title={dialogMessage}
              buttonLabel={trans('ok')}
              onPress={() => this.handleDialog()}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

export default withNavigation(RegisterOne);
