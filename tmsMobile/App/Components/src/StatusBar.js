import React from 'react';
import { StatusBar } from 'react-native';
import Colors from '../../Themes';

const statusBar = (props) => {
  const {
    hideStatusBar, backgroundColor, translucent, barStyle
  } = props;
  return (
    <StatusBar
      hidden={hideStatusBar}
      translucent={!!translucent}
      backgroundColor={backgroundColor ? 'transparent' : Colors.base}
      barStyle={barStyle || 'light-content'}
    />
  );
};

export default statusBar;
