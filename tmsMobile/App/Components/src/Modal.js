import React from 'react';
import { StyleSheet, Platform, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import AndroidDimensions from 'react-native-extra-dimensions-android';

const customModal = (props) => {
  const {
    visible, onBackdropPress, children, customStyle,
    animationIn, animationOut, onModalHide, onModalWillHide, onBackButtonPress
  } = props;
  const deviceWidth = Dimensions.get('window').width;
  const deviceHeight = Platform.OS === 'ios'
    ? Dimensions.get('window').height
    : AndroidDimensions.get('REAL_WINDOW_HEIGHT');
  return (
    <Modal
      animationIn={animationIn || 'fadeIn'}
      animationOut={animationOut || 'fadeOut'}
      propagateSwipe
      onBackButtonPress={onBackButtonPress}
      deviceWidth={deviceWidth}
      deviceHeight={deviceHeight}
      style={[styles.container, customStyle]}
      isVisible={visible}
      onModalWillHide={onModalWillHide}
      onModalHide={onModalHide}
      avoidKeyboard
      onBackdropPress={onBackdropPress}
      backdropTransitionOutTiming={0}
      swipeThreshold={50}
      hideModalContentWhileAnimating
    >
      { children }
    </Modal>
  );
};

export default customModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0
  }
});
