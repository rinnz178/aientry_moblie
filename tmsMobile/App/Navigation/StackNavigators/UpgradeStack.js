import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import { HeaderBackButton } from '../../Components';
import defaultNavigationOptions from '../NavigationOptions';
import Upgrade from '../../Containers/Upgrade/Upgrade';
import Details from '../../Containers/Upgrade/Details';
import Colors from '../../Themes';
import trans from '../../Translations/Trans';

const UpgradeStack = createStackNavigator({
  Upgrade: {
    screen: Upgrade,
    navigationOptions: () => ({
      ...defaultNavigationOptions,
      headerRight: null,
      headerTitle: trans('upgrades')
    }),
  },
  Details: {
    screen: Details,
    navigationOptions: ({ navigation }) => ({
      headerLeft: (
        <HeaderBackButton
          name="ios-close"
          onPress={() => navigation.goBack()}
          color={Colors.gray}
        />),
      headerBackground: null,
      headerTransparent: true,
      headerStyle: {
        height: responsiveHeight(15),
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0
      }
    }),
  },
},
{
  mode: 'modal'
});

UpgradeStack.navigationOptions = ({ navigation }) => ({
  tabBarVisible: navigation.state.index < 1
});

export default UpgradeStack;
