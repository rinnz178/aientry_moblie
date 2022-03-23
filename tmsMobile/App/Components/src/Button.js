import React from 'react';
import { TouchableOpacity } from 'react-native';

const Button = (props) => {
  const {
    hitSlop, style, onPress, children, disabled, activeOpacity
  } = props;
  return (
    <TouchableOpacity
      style={style}
      onPress={onPress}
      disabled={disabled}
      hitSlop={hitSlop || {
        top: 12, bottom: 12, left: 12, right: 12
      }}
      activeOpacity={activeOpacity || 0.7}
    >
      {children}
    </TouchableOpacity>
  );
};


export default Button;
