import React from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import LinearGradient from 'react-native-linear-gradient';
import AlbumView from '../../Containers/Gallery/AlbumView';
import defaultNavigationOptions from '../NavigationOptions';
import Files from '../../Containers/Files/FileViewer';
import Colors from '../../Themes';
import trans from '../../Translations/Trans';

const styles = StyleSheet.create({
  background: {
    flex: 1,
    height: 80,
  }
});

const GalleryStack = createStackNavigator({
  AlbumView: {
    screen: AlbumView,
    navigationOptions: () => ({
      header: null
    }),
  }
},
{
  headerLayoutPreset: 'center'
});

const RouteConfigs = {
  Files,
  GalleryStack: {
    screen: GalleryStack,
    navigationOptions: {
      title: 'Album',
    }
  },
};

const TabNavigatorConfig = {
  swipeEnabled: true,
  tabBarOptions: {
    activeTintColor: Colors.base,
    inactiveTintColor: Colors.gray,
    indicatorStyle: {
      backgroundColor: Colors.base
    },
    labelStyle: {
      fontSize: responsiveFontSize(1.8),
    },
    style: {
      backgroundColor: 'white',
    },
  },
};

const TopTab = createMaterialTopTabNavigator(RouteConfigs, TabNavigatorConfig);

const Stack = createStackNavigator({
  Gallery: {
    screen: TopTab,
    navigationOptions: () => ({
      ...defaultNavigationOptions,
      headerRight: null,
      headerTitle: trans('gallery'),
      headerBackground: (
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={Colors.baseColorGradient}
          style={styles.background}
        />
      ),
      headerStyle: {
        height: responsiveHeight(8),
        elevation: 0,
        shadowOpacity: 0,
        backgroundColor: Colors.lightGray,
        borderBottomWidth: 0
      }
    })
  },
},
{
  headerLayoutPreset: 'center'
});

export default Stack;
