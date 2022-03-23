import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import Button from './Button';
import Colors from '../../Themes';

/**
 * Placeholder component for empty list or server error.
 *
 * @param {} props
 * style {Object} - custom container style
 * hideImage {Boolean} - default is false
 * imageSrc {String} - placeholder image
 * message {String} - placeholder text or a short description of the screen opened.
 * buttonText {String} - Title/text of the button
 * onPress {function} - behaviour of the button if the user will press the button.
 * hideButton {Boolean}- default is false
 *
 * return <Placeholder />
 */

const Placeholder = (props) => {
  const {
    style, hideImage, imageSrc, message, btnText, onPress, hideButton,
    btnStyle, btnTextStyle, imageStyle,
  } = props;
  return (
    <View style={[styles.container, style]}>
      {
        !hideImage && (
        <FastImage
          source={imageSrc}
          style={imageStyle || {
            height: responsiveHeight(35),
            width: responsiveWidth(40),
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
        )
      }
      <Text style={styles.messageStyle}>{message}</Text>
      {
        !hideButton && (
          <Button style={btnStyle || styles.btnStyle} onPress={onPress}>
            <Text style={btnTextStyle || styles.btnTextStyle}>
              {btnText || 'Button'}
            </Text>
          </Button>
        )
      }
    </View>
  );
};

export default Placeholder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.lightGray
  },
  messageStyle: {
    color: Colors.black,
    paddingHorizontal: '15%',
    textAlign: 'center',
    fontSize: responsiveFontSize(1.8)
  },
  btnTextStyle: {
    textAlign: 'center',
    fontSize: responsiveFontSize(1.8)
  },
  btnStyle: {
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 10,
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: responsiveHeight(4),
    height: responsiveHeight(5),
    paddingHorizontal: '5%'
  },
});
