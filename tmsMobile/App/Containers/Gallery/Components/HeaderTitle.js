import React from 'react';
import { Text } from 'react-native';
import styles from '../DeviceImageGalleryStyle';

export default function HeaderTitle(props) {
  const { title } = props;
  return (
    <Text
      numberOfLines={1}
      ellipsizeMode="tail"
      style={styles.header}
    >
      {title}
    </Text>
  );
}
