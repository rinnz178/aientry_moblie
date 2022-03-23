import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import LinearGradient from 'react-native-linear-gradient';
import Button from './Button';
import Colors from '../../Themes';

const GradientButton = (props) => {
  const {
    onPress, customStyle, title, children
  } = props;
  return (
    <Button
      onPress={onPress}
    >
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={['#ff9900', '#ff6600']}
        style={customStyle}
      >
        {title !== null && <Text style={styles.buttonTitle}>{title}</Text>}
        {children}
      </LinearGradient>
    </Button>
  );
};

export default GradientButton;

const styles = StyleSheet.create({
  buttonTitle: {
    fontSize: responsiveFontSize(2),
    textAlign: 'center',
    color: Colors.white
  },
});
