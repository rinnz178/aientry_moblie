import React from 'react';
import { StyleSheet } from 'react-native';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { Button, CustomIcon } from '../../../Components';

export default function HeaderGalleryIcon(props) {
  const { onPress, isVisible } = props;
  return (
    isVisible ? (
      <Button style={styles.buttonMargin} onPress={onPress}>
        <CustomIcon
          name="images"
          icon="entypo"
          size={styles.iconSize}
          style={styles.iconColor}
        />
      </Button>
    ) : null
  );
}

const styles = StyleSheet.create({
  buttonMargin: {
    marginRight: responsiveWidth(5)
  },
  iconColor: {
    color: 'white'
  },
  iconSize: responsiveWidth(8)
});
