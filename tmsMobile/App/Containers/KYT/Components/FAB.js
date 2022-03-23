import React from 'react';
import { FloatingAction } from 'react-native-floating-action';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { CustomIcon } from '../../../Components';
import Colors from '../../../Themes';

const FAB = (props) => {
  const { onPress } = props;
  return (
    <FloatingAction
      showBackground={false}
      color={Colors.base}
      buttonSize={responsiveHeight(9)}
      floatingIcon={<CustomIcon name="ios-add" size={responsiveHeight(6)} color={Colors.white} />}
      animated
      onPressMain={onPress}
      distanceToEdge={{ vertical: responsiveHeight(11), horizontal: responsiveWidth(4) }}
    />
  );
};

export default FAB;
