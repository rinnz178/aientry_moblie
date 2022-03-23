import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CustomIcon } from '../../../Components';
import Colors from '../../../Themes';

const UnselectedImageOverlay = () => (
  <View style={styles.unCheckOverlay}>
    <CustomIcon
      name="circle-o"
      icon="font-awesome"
      size={30}
      style={styles.uncheckIcon}
    />
  </View>
);

export default UnselectedImageOverlay;

const styles = StyleSheet.create({
  unCheckOverlay: {
    flex: 1,
    borderWidth: 4,
    borderColor: 'transparent',
    height: '100%',
    alignItems: 'flex-end',
    width: '100%',
    backgroundColor: 'transparent',
  },
  uncheckIcon: {
    marginTop: 5,
    marginRight: 5,
    color: Colors.white,
    opacity: 0.3
  },
});
