import React from 'react';
import { FloatingAction } from 'react-native-floating-action';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import CustomIcon from './Icon';
import Colors from '../../Themes';

const FAB = (props) => {
  const {
    onPress, icon = 'ios-add', onPressItem, refs, actions
  } = props;

  return (
    <FloatingAction
      showBackground={false}
      color={Colors.base}
      buttonSize={responsiveHeight(8)}
      ref={refs}
      actions={actions}
      floatingIcon={(
        <CustomIcon
          name={icon}
          size={responsiveHeight(6)}
          color={Colors.white}
        />
      )}
      animated
      onPressMain={onPress}
      onPressItem={onPressItem}
      distanceToEdge={{
        vertical: responsiveHeight(2),
        horizontal: responsiveWidth(5),
      }}
    />
  );
};

export default FAB;
