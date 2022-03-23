import React from 'react';
import { View, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';

const ButtonLoader = () => (
  <View style={styles.container}>
    <Progress.CircleSnail color={['white']} spinDuration={1500} strokeCap="butt" />
  </View>
);

export default ButtonLoader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
