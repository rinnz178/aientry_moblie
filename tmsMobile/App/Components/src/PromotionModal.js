import React from 'react';
import {
  StyleSheet, Text, View
} from 'react-native';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions';
import FastImage from 'react-native-fast-image';
import ModalContainer from './ModalContainer';
import Modal from './Modal';
import GradientButton from './GradientButton';
import CustomIcon from './Icon';
import Button from './Button';

import Colors from '../../Themes';
import ButtonLoader from './ButtonLoader';

const PromotionModal = (props) => {
  const {
    icon, onModalHide, onModalWillHide, header, visible,
    onClose, onPress, onLoad, description, buttonText
  } = props;
  return (
    <Modal
      customStyle={[styles.centerContent, styles.modalWidth]}
      onModalWillHide={onModalWillHide}
      onModalHide={onModalHide}
      visible={visible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <ModalContainer style={styles.modalContainer}>
        <View style={styles.closeButtonWrapper}>
          <Button onPress={onClose}>
            <CustomIcon name="ios-close" size={40} />
          </Button>
        </View>
        <FastImage
          source={icon}
          style={styles.imageIcon}
          resizeMode={FastImage.resizeMode.contain}
        />
        <Text style={styles.header}>{header}</Text>
        <Text style={styles.description}>
          {description}
        </Text>
        <View style={styles.buttonWrapper}>
          <GradientButton
            title={buttonText}
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

export default PromotionModal;

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
    marginTop: '4%',
    paddingHorizontal: '2%',
    flexDirection: 'row'
  },
  closeButtonWrapper: {
    width: '100%',
    alignItems: 'flex-end',
    paddingRight: '5%'
  },
});
