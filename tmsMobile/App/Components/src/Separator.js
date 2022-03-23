import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '../../Themes';

const Separator = (props) => {
  const { customStyle } = props;
  return (
    <View style={[styles.separator, customStyle]} />
  );
};

export default Separator;

const styles = StyleSheet.create({
  separator: {
    borderBottomColor: Colors.lightGray,
    borderBottomWidth: 1
  }
});
