import React from 'react';
import { TouchableWithoutFeedback, StyleSheet, View } from 'react-native';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import { Header } from 'react-navigation-stack';
import CustomIcon from './Icon';
import Colors from '../../Themes';

const HeaderBackButton = (props) => {
  const { onPress, color, name } = props;
  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      hitSlop={{
        top: 8, bottom: 8, left: 12, right: 15
      }}
    >
      <View style={styles.iconWrapper}>
        <CustomIcon
          size={responsiveHeight(5)}
          name={name || 'ios-arrow-back'}
          color={color || Colors.white}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default HeaderBackButton;

const styles = StyleSheet.create({
  iconWrapper: {
    height: Header.HEIGHT + 10,
    paddingLeft: 20,
    paddingRight: 30,
    justifyContent: 'center'
  }
});
