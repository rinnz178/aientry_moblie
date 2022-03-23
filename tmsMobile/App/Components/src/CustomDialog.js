import React from 'react';
import {
  StyleSheet, Image, Text, View
} from 'react-native';
import { responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import ModalContainer from './ModalContainer';
import Modal from './Modal';
import Colors from '../../Themes';
import GradientButton from './GradientButton';

const CustomDialog = (props) => {
  const {
    visible, onModalHide, onModalWillHide, renderIcon,
    title, description, buttonLabel, onPress
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
        {
          renderIcon
          && <Image source={renderIcon} style={styles.imageIcon} />
        }
        {
          title
          && <Text>{title}</Text>
        }
        {
          description
          && <Text style={styles.description}>{description}</Text>
        }
        <View style={styles.buttonWrapper}>
          <GradientButton
            title={buttonLabel}
            onPress={onPress}
            customStyle={styles.button}
          />
        </View>
      </ModalContainer>
    </Modal>
  );
};

export default CustomDialog;

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
    width: responsiveWidth(15),
    height: responsiveHeight(15),
    resizeMode: 'contain'
  },
  userEmail: {
    color: Colors.base,
    fontStyle: 'italic'
  },
  buttonWrapper: {
    marginTop: '10%',
    width: '100%'
  },
  button: {
    height: responsiveHeight(9),
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    justifyContent: 'center'
  },
  description: {
    textAlign: 'center',
    marginHorizontal: '5%'
  }
});
