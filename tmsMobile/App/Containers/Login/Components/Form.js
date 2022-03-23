import React, { PureComponent } from 'react';
import {
  Text, TextInput, View, StyleSheet,
} from 'react-native';
import { responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions';
import CustomIcon from '../../../Components/src/Icon';
import Button from '../../../Components/src/Button';
import GradientButton from '../../../Components/src/GradientButton';
import trans from '../../../Translations/Trans';
import Colors from '../../../Themes';
import ButtonLoader from '../../../Components/src/ButtonLoader';

class LoginForm extends PureComponent {
  constructor() {
    super();
    this.state = {
      showPassword: false
    };
    this.displayPassword = this.displayPassword.bind(this);
  }

  displayPassword() {
    const { showPassword } = this.state;
    this.setState({ showPassword: !showPassword });
  }

  render() {
    const vm = this;
    const { showPassword } = this.state;
    const {
      onSubmit, usernameValue, passwordValue, children, confirmPassValue,
      hidePasswordField, buttonText, style, hideConfirmPassword, showPasswordToggle, onLoad
    } = this.props;
    return (
      <View style={style}>
        {
          // this will be rendered if show reset form is true
          hidePasswordField
          && (
            <View style={[styles.container, styles.headerView]}>
              <Text style={styles.headerContent}>{trans('forgotPassGuide')}</Text>
            </View>
          )
        }
        {
          // Email Text Field
          <View style={[styles.textInputView]}>
            <TextInput
              editable={!onLoad}
              style={styles.textInputStyle}
              keyboardType="email-address"
              placeholder={trans('email')}
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={(userName) => { vm.props.userOnChangeText(userName); }}
              value={usernameValue}
              blurOnSubmit={!!hidePasswordField}
              returnKeyType={hidePasswordField ? 'done' : 'next'}
              onSubmitEditing={() => { !hidePasswordField && this.Password.focus(); }}
            />
          </View>
        }
        {
          // Password Text Field
          !hidePasswordField
            && (
              <View style={[styles.textInputView, { marginTop: responsiveHeight(2) }]}>
                <TextInput
                  editable={!onLoad}
                  style={[styles.textInputStyle]}
                  placeholder={trans('password')}
                  autoCapitalize="none"
                  secureTextEntry={showPassword === false}
                  onChangeText={(passWord) => { vm.props.passwordOnChangeText(passWord); }}
                  value={passwordValue}
                  blurOnSubmit={!!hideConfirmPassword}
                  returnKeyType={hideConfirmPassword ? 'done' : 'next'}
                  ref={(Password) => { this.Password = Password; }}
                  maxLength={8}
                  onSubmitEditing={() => { !hideConfirmPassword && this.ConfirmPassword.focus(); }}
                />
                {
                  showPasswordToggle && (
                    <Button
                      style={styles.passwordToggle}
                      onPress={() => this.displayPassword()}
                      activeOpacity={1}
                    >
                      <CustomIcon name={showPassword ? 'ios-eye' : 'ios-eye-off'} />
                    </Button>
                  )
                }
              </View>
            )
        }
        {
          // Confirm Password Text Field
          !hideConfirmPassword
            && (
              <View style={[styles.textInputView, { marginTop: responsiveHeight(2) }]}>
                <TextInput
                  editable={!onLoad}
                  style={[styles.textInputStyle]}
                  placeholder={trans('confirmPassword')}
                  autoCapitalize="none"
                  secureTextEntry={showPassword === false}
                  onChangeText={(passWord) => { vm.props.confirmPasswordOnChangeText(passWord); }}
                  value={confirmPassValue}
                  returnKeyType="done"
                  maxLength={8}
                  ref={(ConfirmPassword) => { this.ConfirmPassword = ConfirmPassword; }}
                />
              </View>
            )
        }
        <View style={styles.submitButtonView}>
          <GradientButton
            onPress={onSubmit}
            title={buttonText}
            customStyle={styles.submitButton}
          >
            { onLoad && <ButtonLoader /> }
          </GradientButton>
        </View>
        {children}
      </View>
    );
  }
}

export default LoginForm;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  textInputView: {
    flexDirection: 'row',
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    alignItems: 'center'
  },
  textInputStyle: {
    fontSize: responsiveFontSize(2),
    height: responsiveHeight(9),
    width: '100%',
    paddingLeft: '5%',
  },
  submitButtonView: {
    marginTop: '10%'
  },
  submitButton: {
    height: responsiveHeight(10),
    borderRadius: 8,
    justifyContent: 'center',
  },
  passwordToggle: {
    right: 15,
    position: 'absolute'
  },
  /* Reset Header */
  headerView: {
    height: responsiveHeight(8),
    width: '100%',
    marginBottom: '5%',
  },
  headerContent: {
    fontSize: responsiveFontSize(1.8),
    textAlign: 'center'
  },
});
