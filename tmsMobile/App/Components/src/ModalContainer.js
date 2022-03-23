import React from 'react';
import { View, StyleSheet } from 'react-native';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import Colors from '../../Themes';

const ModalContainer = (props) => {
  const { height, children, style } = props;
  return (
    <View style={[styles.container, style, { height }]}>
      { children }
    </View>
  );
};

export default ModalContainer;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: Colors.white,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    alignItems: 'center',
    height: responsiveHeight(50),
  }
});
