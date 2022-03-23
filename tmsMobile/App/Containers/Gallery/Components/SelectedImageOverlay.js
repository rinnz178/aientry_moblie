import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CustomIcon } from '../../../Components';

const SelectedImageOverlay = () => (
  <View style={styles.checkOverlay}>
    <CustomIcon
      name="check-circle"
      icon="font-awesome"
      size={30}
      style={styles.checkIcon}
    />
  </View>
);

export default SelectedImageOverlay;

const styles = StyleSheet.create({
  checkOverlay: {
    flex: 1,
    borderWidth: 4,
    borderColor: 'chocolate',
    alignItems: 'flex-end',
    height: '100%',
    width: '100%',
    backgroundColor: 'transparent',
  },
  checkIcon: {
    marginTop: 5,
    marginRight: 5,
    color: 'chocolate',
  },
});
