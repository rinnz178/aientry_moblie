import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import Button from './Button';
import Separator from './Separator';
import Colors from '../../Themes';

const ActionPicker = (props) => {
  const {
    onPress, text, hideSeparator, color
  } = props;

  return (
    <View style={[styles.viewContent, styles.width]}>
      <Button
        style={[styles.viewContent, styles.width]}
        onPress={onPress}
      >
        <Text style={[styles.textStyle, color && { color }]}>{text}</Text>
      </Button>
      {
        !hideSeparator
        && <Separator customStyle={styles.width} />
      }
    </View>
  );
};

export default ActionPicker;

const styles = StyleSheet.create({
  viewContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  width: {
    width: '100%'
  },
  textStyle: {
    color: Colors.base,
    fontSize: responsiveFontSize(2)
  }
});
