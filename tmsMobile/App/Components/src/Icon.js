import React from 'react';
import { Icon } from 'react-native-elements';
import Colors from '../../Themes';

const CustomIcon = (props) => {
  const {
    name, color, size, onPress, icon, style
  } = props;
  return (
    <Icon
      iconStyle={style}
      color={color || Colors.placeHolderIcon}
      size={size || 25}
      type={icon || 'ionicon'}
      name={name}
      onPress={onPress}
    />
  );
};

export default CustomIcon;
