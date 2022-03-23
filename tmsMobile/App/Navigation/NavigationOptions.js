import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import Colors from '../Themes';

const styles = StyleSheet.create({
  titleStyle: {
    textAlign: 'center',
    flex: 1
  },
  background: {
    flex: 1,
    height: 80,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30
  }
});

/**
 * set headerRight to null if the screen doesn't have a back button
 */
const defaultNavigationOptions = {
  headerTintColor: Colors.white,
  headerRight: (<View />),
  headerTitleStyle: styles.titleStyle,
  headerBackground: (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      colors={['#ff9900', '#ff9900', '#ff6600']}
      style={styles.background}
    />
  ),
  gesturesEnabled: true,
  headerStyle: {
    height: responsiveHeight(15),
    elevation: 0,
    shadowOpacity: 0,
    backgroundColor: Colors.lightGray,
    borderBottomWidth: 0
  }
};

export default defaultNavigationOptions;
