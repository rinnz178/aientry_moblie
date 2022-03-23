import React from 'react';
import {
  StyleSheet, Image, Text, View
} from 'react-native';
import * as Progress from 'react-native-progress';
import { responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import { ModalContainer, Modal, GradientButton } from '../../../Components';
import trans from '../../../Translations/Trans';

const UploadProgress = (props) => {
  const {
    visible, onModalHide, onModalWillHide, renderIcon,
    description, buttonLabel, onPress, progress
  } = props;
  return (
    <Modal
      customStyle={styles.modalContainer}
      onModalWillHide={onModalWillHide}
      onModalHide={onModalHide}
      visible={visible}
      animationIn="fadeIn"
      animationOut="fadeOut"
    >
      <ModalContainer style={styles.modalContent}>
        {
          (description === trans('upload')) && (
            <Progress.Circle
              progress={progress}
              thickness={5}
              showsText
              size={80}
              color="orange"
              style={styles.progressCircle}
            />
          )
        }
        {
          renderIcon
          && <Image source={renderIcon} style={styles.imageIcon} />
        }
        {
          (description !== trans('upload'))
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

export default UploadProgress;

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '95%'
  },
  modalContent: {
    width: '80%',
    marginLeft: '5%',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  imageIcon: {
    width: responsiveWidth(15),
    height: responsiveHeight(15),
    resizeMode: 'contain'
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
    textAlign: 'center'
  },
  progressCircle: {
    marginVertical: '5%'
  }
});
