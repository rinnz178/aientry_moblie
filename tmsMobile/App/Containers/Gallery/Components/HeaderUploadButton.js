import React from 'react';
import { Text } from 'react-native';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { Button } from '../../../Components';
import styles from '../DeviceImageGalleryStyle';
import trans from '../../../Translations/Trans';

export default function HeaderUploadButton(props) {
  const { disabled, onPress } = props;
  return (
    <Button
      style={[styles.buttonStyle, { marginRight: responsiveWidth(5) }]}
      disabled={!disabled}
      onPress={onPress}
    >
      <Text style={[
        styles.actionsText, styles.gainsboro, { opacity: disabled ? 1 : 0.5 }
      ]}
      >
        {trans('upload')}
      </Text>
    </Button>
  );
}
