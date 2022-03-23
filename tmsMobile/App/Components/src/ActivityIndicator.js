import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import Colors from '../../Themes';

const Loader = (props) => {
  const { size } = props;
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size ? 'small' : 'large'} color={Colors.gray} />
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
