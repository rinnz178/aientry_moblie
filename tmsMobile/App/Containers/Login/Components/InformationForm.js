import React, { PureComponent } from 'react';
import {
  TextInput, View, StyleSheet, Platform, Text
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  responsiveHeight, responsiveFontSize
} from 'react-native-responsive-dimensions';
import GradientButton from '../../../Components/src/GradientButton';
import trans from '../../../Translations/Trans';
import Colors from '../../../Themes';
import FormHeader from './FormHeader';
import { ButtonLoader } from '../../../Components';


class InformationForm extends PureComponent {
  componentDidMount() {
    this.scrollToEnd = this.scrollToEnd.bind(this);
  }

  scrollToEnd() {
    this.scrollRef.props.scrollToEnd(true);
  }

  render() {
    const vm = this;
    const {
      onSubmit, children, lastName, firstName, companyName, contactNum1,
      zipCode, companyAddress1, companyAddress2, buttonText, style, onLoad,
      contactNum2, contactNum3,
    } = this.props;
    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        enableResetScrollToCoords={false}
        extraHeight={0}
        innerRef={(ref) => { this.scrollRef = ref; }}
      >
        <View style={[style, styles.container]}>
          <View style={styles.formWrapper}>
            <FormHeader title={trans('personalInformation')} />
            <View style={[styles.textInputView]}>
              <TextInput
                editable={!onLoad}
                style={styles.textInputStyle}
                placeholder={trans('lastName')}
                autoCorrect={false}
                onChangeText={(LastName) => { vm.props.lastNameOnChangeText(LastName); }}
                value={lastName}
                blurOnSubmit={false}
                returnKeyType="next"
                onSubmitEditing={() => this.FirstName.focus()}
              />
            </View>
            <View style={[styles.textInputView, { marginBottom: responsiveHeight(8) }]}>
              <TextInput
                editable={!onLoad}
                style={styles.textInputStyle}
                placeholder={trans('firstName')}
                autoCorrect={false}
                onChangeText={(FirstName) => { vm.props.firstNameOnChangeText(FirstName); }}
                value={firstName}
                blurOnSubmit={false}
                returnKeyType="next"
                ref={(FirstName) => { this.FirstName = FirstName; }}
                onSubmitEditing={() => this.CompanyName.focus()}
              />
            </View>
          </View>
          <View style={styles.formWrapper}>
            <FormHeader title={trans('companyInformation')} />
            <View style={[styles.textInputView]}>
              <TextInput
                editable={!onLoad}
                style={styles.textInputStyle}
                placeholder={trans('companyName')}
                autoCorrect={false}
                onChangeText={(CompanyName) => { vm.props.companyNameOnChangeText(CompanyName); }}
                value={companyName}
                blurOnSubmit={false}
                returnKeyType="next"
                ref={(CompanyName) => { this.CompanyName = CompanyName; }}
                onSubmitEditing={() => this.ZipCode.focus()}
              />
            </View>
            <View style={[styles.textInputView]}>
              <TextInput
                editable={!onLoad}
                style={styles.textInputStyle}
                keyboardType="numeric"
                placeholder={trans('zipCode')}
                autoCorrect={false}
                autoCapitalize="none"
                maxLength={7}
                onChangeText={(ZipCode) => { vm.props.zipCodeOnChangeText(ZipCode); }}
                value={zipCode}
                blurOnSubmit={false}
                returnKeyType={Platform.OS === 'ios' ? 'done' : 'next'}
                ref={(ZipCode) => { this.ZipCode = ZipCode; }}
                onSubmitEditing={() => this.CompanyAddress1.focus()}
              />
            </View>
            <View style={[styles.textInputView]}>
              <TextInput
                editable={!onLoad}
                style={styles.textInputStyle}
                placeholder={trans('companyAddress1')}
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={(AddressOne) => { vm.props.addressOneOnChangeText(AddressOne); }}
                value={companyAddress1}
                blurOnSubmit={false}
                returnKeyType="next"
                ref={(CompanyAddress1) => { this.CompanyAddress1 = CompanyAddress1; }}
                onSubmitEditing={() => this.CompanyAddress2.focus()}
              />
            </View>
            <View style={[styles.textInputView]}>
              <TextInput
                editable={!onLoad}
                style={styles.textInputStyle}
                placeholder={trans('companyAddress2')}
                autoCorrect={false}
                blurOnSubmit={false}
                autoCapitalize="none"
                onChangeText={(AddressTwo) => { vm.props.addressTwoOnChangeText(AddressTwo); }}
                value={companyAddress2}
                returnKeyType="next"
                ref={(CompanyAddress2) => { this.CompanyAddress2 = CompanyAddress2; }}
                onSubmitEditing={() => this.CompanyNumber1.focus()}
              />
            </View>
            <View>
              <Text style={styles.companyPhonePlaceholder}>{trans('companyNumber')}</Text>
            </View>
            <View style={styles.phoneFieldWrapper}>
              <View style={styles.phoneFieldSegment}>
                <TextInput
                  editable={!onLoad}
                  style={[styles.textInputStyle, { paddingLeft: '15%' }]}
                  keyboardType="phone-pad"
                  placeholder="XXXX"
                  autoCorrect={false}
                  autoCapitalize="none"
                  maxLength={4}
                  onChangeText={(CompContact) => {
                    vm.props.contactNumOneOnChangeText(CompContact);
                  }}
                  value={contactNum1}
                  blurOnSubmit={false}
                  returnKeyType={Platform.OS === 'ios' ? 'done' : 'next'}
                  ref={(companyNumber) => { this.CompanyNumber1 = companyNumber; }}
                  onSubmitEditing={() => this.CompanyNumber2.focus()}
                />
              </View>
              <View style={[styles.phoneFieldSegment, styles.phoneFieldCenterSegment]}>
                <TextInput
                  editable={!onLoad}
                  style={[styles.textInputStyle, styles.phoneTextInputField]}
                  keyboardType="phone-pad"
                  placeholder="XXXX"
                  autoCorrect={false}
                  autoCapitalize="none"
                  maxLength={4}
                  onChangeText={(CompContact) => {
                    vm.props.contactNumTwoOnChangeText(CompContact);
                  }}
                  value={contactNum2}
                  blurOnSubmit={false}
                  returnKeyType={Platform.OS === 'ios' ? 'done' : 'next'}
                  ref={(companyNumber) => { this.CompanyNumber2 = companyNumber; }}
                  onSubmitEditing={() => this.CompanyNumber3.focus()}
                />
              </View>
              <View style={styles.phoneFieldSegment}>
                <TextInput
                  editable={!onLoad}
                  style={[styles.textInputStyle, styles.phoneTextInputField]}
                  keyboardType="phone-pad"
                  placeholder="XXXX"
                  autoCorrect={false}
                  autoCapitalize="none"
                  maxLength={4}
                  onChangeText={(CompContact) => {
                    vm.props.contactNumThreeOnChangeText(CompContact);
                  }}
                  value={contactNum3}
                  returnKeyType="done"
                  ref={(companyNumber) => { this.CompanyNumber3 = companyNumber; }}
                  onSubmitEditing={() => this.scrollToEnd()}
                />
              </View>
            </View>
            <View>
              <Text style={styles.exampleFormat}>
                eg. [023-4567-8901], [02-3456-7890], [0234-56-7890]
              </Text>
            </View>
            <View style={styles.submitButtonView}>
              <GradientButton
                onPress={onSubmit}
                title={buttonText}
                customStyle={styles.submitButton}
              >
                { onLoad && <ButtonLoader />}
              </GradientButton>
            </View>
            {children}
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

export default InformationForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '10%',
    marginBottom: '5%',
  },
  textInputView: {
    flexDirection: 'row',
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: responsiveHeight(1.5),
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
  formWrapper: {
    flex: 1,
    alignContent: 'center'
  },
  companyPhonePlaceholder: {
    marginTop: responsiveHeight(1.5),
    color: Colors.gray,
  },
  phoneFieldWrapper: {
    flex: 1,
    flexDirection: 'row',
    marginTop: responsiveHeight(1),
    alignItems: 'center',
  },
  phoneFieldSegment: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
  },
  phoneFieldCenterSegment: {
    marginHorizontal: '2%'
  },
  phoneTextInputField: {
    paddingLeft: '15%'
  },
  exampleFormat: {
    marginTop: responsiveHeight(1),
    textAlign: 'center',
    fontSize: responsiveFontSize(1.5),
    color: Colors.gray,
  }
});
