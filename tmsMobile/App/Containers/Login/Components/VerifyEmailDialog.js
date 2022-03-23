import React from 'react';
import {
  StyleSheet, Image, Text, View
} from 'react-native';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions';
import {
  ModalContainer, Modal, GradientButton, CustomIcon, Button
} from '../../../Components';
import Colors from '../../../Themes';
import EmailIcon from '../../../Images/icon_email_verification.png';
import trans from '../../../Translations/Trans';
import ButtonLoader from '../../../Components/src/ButtonLoader';

const VerifyEmailDialog = (props) => {
  const {
    visible, onModalHide, onModalWillHide,
    username, onClose, onPress, onLoad,
  } = props;
  return (
    <Modal
      customStyle={[styles.centerContent, styles.modalWidth]}
      onModalWillHide={onModalWillHide}
      onModalHide={onModalHide}
      visible={visible}
      animationIn="fadeIn"
      animationOut="fadeOut"
    >
      <ModalContainer style={styles.modalContainer}>
        <View style={styles.closeButtonWrapper}>
          <Button onPress={onClose}>
            <CustomIcon name="ios-close" size={40} />
          </Button>
        </View>
        <Image source={EmailIcon} style={styles.imageIcon} />
        <Text style={styles.header}>{trans('verifyYourAccount')}</Text>
        <Text style={styles.description}>
          {trans('pleaseVerifyAccount')}
          <Text style={{ color: Colors.base }}>
            {` ${username}` }
          </Text>
          .
        </Text>
        <View style={styles.buttonWrapper}>
          <GradientButton
            title={!onLoad ? trans('resendVerification') : null}
            onPress={onPress}
            customStyle={styles.button}
          >
            { onLoad && <ButtonLoader /> }
          </GradientButton>
        </View>
      </ModalContainer>
    </Modal>
  );
};

export default VerifyEmailDialog;

const styles = StyleSheet.create({
  modalContainer: {
    width: '98%',
    marginLeft: '5%',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  modalWidth: {
    width: '95%'
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageIcon: {
    width: responsiveWidth(20),
    height: responsiveHeight(15),
    resizeMode: 'contain'
  },
  buttonWrapper: {
    marginVertical: '10%',
    width: '80%'
  },
  button: {
    height: responsiveHeight(9),
    borderRadius: 10,
    justifyContent: 'center'
  },
  header: {
    fontSize: responsiveFontSize(2.5),
    color: Colors.base
  },
  description: {
    textAlign: 'center',
    fontSize: responsiveFontSize(1.7),
    paddingHorizontal: '2%',
    flexDirection: 'row'
  },
  closeButtonWrapper: {
    width: '100%',
    alignItems: 'flex-end',
    paddingRight: '5%'
  },
});
