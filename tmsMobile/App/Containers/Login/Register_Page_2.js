import React, { PureComponent } from 'react';
import {
  View, Keyboard, StatusBar, SafeAreaView
} from 'react-native';
import { withNavigation } from 'react-navigation';
import styles from './AuthCommonStyle';
import { CustomDialog } from '../../Components';
import trans from '../../Translations/Trans';
import checkIcon from '../../Images/icon_checkmark.png';
import infoIcon from '../../Images/icon_info.png';
import InformationForm from './Components/InformationForm';
import { ZipCode, Register } from '../../Services';
import FormValidator from '../../Utils/FormValidator';
import validatePhoneNumber from '../../Utils/PhoneNumberValidator';

class RegisterPageTwo extends PureComponent {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const { credentials } = navigation.state.params;
    this.state = {
      data: {
        email: credentials.email,
        password: credentials.password,
        confirmPassword: credentials.confirmPassword,
        lastName: '',
        firstName: '',
        companyName: '',
        contactNum1: '',
        contactNum2: '',
        contactNum3: '',
        companyAddress1: '',
      },
      zipCode: '',
      companyAddress2: '',
      showAlertDialog: false,
      dialogMessage: '',
      onPressDialog: null,
    };

    this.handleDialog = this.handleDialog.bind(this);
    this.submit = this.submit.bind(this);
  }

  /**
   * Function that controls the registration request.
   * @return void
   */
  submit = () => {
    const { data, companyAddress2, zipCode } = this.state;
    Keyboard.dismiss();
    const phoneNum = {
      num1: data.contactNum1,
      num2: data.contactNum2,
      num3: data.contactNum3,
    };
    const invalidPhoneForm = validatePhoneNumber(phoneNum);
    if (FormValidator(data)) { // validate empty field/s
      this.handleDialog(trans('emptyField'));
    } else if (invalidPhoneForm !== '') { // validate contact number
      this.handleDialog(invalidPhoneForm);
    } else if (zipCode.length !== 7 && zipCode.length > 0) {
      this.handleDialog(trans('zipCodeLength'));
    } else if (data.companyAddress1 === companyAddress2) {
      this.handleDialog(trans('addressesShouldBeDifferent'));
    } else { // proceed to api call
      const contactNum = `${data.contactNum1}-${data.contactNum2}-${data.contactNum3}`;
      this.register({
        ...data,
        companyAddress2,
        zipCode,
        companyContactNum: contactNum
      });
    }
  }

  /**
   * API Call for Account Registration.
   * @param {Object} data
   * @return void
   */
  register = (data) => {
    const vm = this;
    const { navigation } = this.props;
    this.handleButtonSpinner();
    Register(data)
      .then(() => {
        vm.handleButtonSpinner();
        vm.handleDialog(trans('adminAccountCreated'), () => navigation.popToTop());
      }).catch((error) => {
        vm.handleButtonSpinner();
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
   * Alert Dialog
   * @param {String} message Dynamic message dialog
   * @param {*} onPressBehavior
   *    handleDialog() => [Show / Hide] dialog. [Default]
   *    navigation.popToTop() => navigate to Login Screen if successfully registered.
   * @return void
   */
  handleDialog(message = null, onPressBehavior = () => this.handleDialog()) {
    const icon = message === trans('adminAccountCreated') ? checkIcon : infoIcon;
    this.setState(prevState => ({
      showAlertDialog: !prevState.showAlertDialog,
      dialogMessage: message || prevState.dialogMessage,
      dialogImageIcon: icon,
      onPressDialog: onPressBehavior,
      showButtonSpinner: false
    }));
  }

  /**
   * [Show / Hide Button Spinner.
   * @return void
   */
  handleButtonSpinner() {
    this.setState(prevState => ({
      showButtonSpinner: !prevState.showButtonSpinner
    }));
  }

  /**
   * Communicates to ZipCode API and retrieve addresses if zipcode exists.
   * @param {Integer} zipCode
   * @return void
   */
  searchAddress(zipCode) {
    const vm = this;
    const { data } = this.state;
    this.setState({ zipCode });

    if (zipCode.length === 7) { // call api only if zipcode has 7 digits
      ZipCode(zipCode)
        .then((response) => {
          if (response.data) {
            const address1 = response.data.address1 + response.data.address2;
            vm.setState({
              data: {
                ...data,
                companyAddress1: address1, // autofill address 1
              },
              companyAddress2: response.data.address3, // autofill address 2
            });
          }
        }).catch((error) => {
          // server error
          if (error.message) {
            vm.handleDialog(trans('networkRequestFailed'));
          }
        });
    }
  }

  render() {
    const {
      showButtonSpinner, showAlertDialog, dialogMessage, data,
      dialogImageIcon, onPressDialog, companyAddress2, zipCode
    } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
        <View style={styles.formsWrapper}>
          <InformationForm // Register Form
            style={styles.formContainer}
            lastNameOnChangeText={(LastName) => {
              this.setState({ data: { ...data, lastName: LastName } });
            }}
            firstNameOnChangeText={(FirstName) => {
              this.setState({ data: { ...data, firstName: FirstName } });
            }}
            companyNameOnChangeText={(CompanyName) => {
              this.setState({ data: { ...data, companyName: CompanyName } });
            }}
            contactNumOneOnChangeText={(ContactNum1) => {
              this.setState({ data: { ...data, contactNum1: ContactNum1 } });
            }}
            contactNumTwoOnChangeText={(ContactNum2) => {
              this.setState({ data: { ...data, contactNum2: ContactNum2 } });
            }}
            contactNumThreeOnChangeText={(ContactNum3) => {
              this.setState({ data: { ...data, contactNum3: ContactNum3 } });
            }}
            zipCodeOnChangeText={zipcode => this.searchAddress(zipcode)}
            addressOneOnChangeText={(CompanyAddress) => {
              this.setState({
                data: {
                  ...data,
                  companyAddress1: CompanyAddress,
                }
              });
            }}
            addressTwoOnChangeText={(CompanyAddress) => {
              this.setState({ companyAddress2: CompanyAddress });
            }}
            buttonText={!showButtonSpinner ? trans('submit') : null}
            lastName={data.lastName}
            firstName={data.firstName}
            companyName={data.companyName}
            contactNum1={data.contactNum1}
            contactNum2={data.contactNum2}
            contactNum3={data.contactNum3}
            zipCode={zipCode}
            companyAddress1={data.companyAddress1}
            companyAddress2={companyAddress2}
            onLoad={showButtonSpinner}
            onSubmit={this.submit}
          />
        </View>
        <CustomDialog
          visible={showAlertDialog}
          renderIcon={dialogImageIcon}
          description={dialogMessage}
          buttonLabel={trans('ok')}
          onPress={onPressDialog}
        />
      </SafeAreaView>
    );
  }
}

export default withNavigation(RegisterPageTwo);
