import React from 'react';
import { StyleSheet } from 'react-native';
import ActivityIndicator from './ActivityIndicator';
import Modal from './Modal';

const Loader = (props) => {
  const { onModalHide, visible } = props;
  return (
    <Modal
      onModalHide={onModalHide}
      animationIn="fadeIn"
      animationOut="fadeOut"
      visible={visible}
      style={styles.container}
    >
      <ActivityIndicator />
    </Modal>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
