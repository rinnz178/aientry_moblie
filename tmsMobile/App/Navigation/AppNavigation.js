import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import {
  responsiveWidth, responsiveHeight,
} from 'react-native-responsive-dimensions';
import FastImage from 'react-native-fast-image';
import Authenticate from '../Utils/AuthenticateUser';
import Camera from '../Containers/Gallery/Camera';
import Colors from '../Themes';

// StacksNavigators
import HomeStack from './StackNavigators/HomeStack';
import AuthStack from './StackNavigators/AuthStack';
import KYTStack from './StackNavigators/KYTStack';
import GalleryStack from './StackNavigators/GalleryStack';
import UpgradeStack from './StackNavigators/UpgradeStack';

// Navigation icons
import activeHome from '../Images/Navigation_Icons/active_home.png';
import inactiveHome from '../Images/Navigation_Icons/inactive_home.png';
import activeKyt from '../Images/Navigation_Icons/active_kyt.png';
import inactiveKyt from '../Images/Navigation_Icons/inactive_kyt.png';
import camera from '../Images/Navigation_Icons/camera.png';
import inactiveUpgrade from '../Images/Navigation_Icons/inactive_upgrade.png';
import activeUpgrade from '../Images/Navigation_Icons/active_upgrade.png';
import activeGallery from '../Images/Navigation_Icons/active_gallery.png';
import inactiveGallery from '../Images/Navigation_Icons/inactive_gallery.png';
import SiteGallery from '../Containers/Gallery/SiteGallery';
import DeviceImageGallery from '../Containers/Gallery/DeviceImageGallery';


const styles = StyleSheet.create({
  defaultIcon: {
    width: responsiveWidth(7),
    height: responsiveHeight(4.5),
  },
  cameraIconWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    marginTop: responsiveHeight(2.3),
    height: responsiveHeight(10),
    width: responsiveWidth(10)
  }
});

const AppTab = createBottomTabNavigator(
  {
    Home: HomeStack,
    KYT: KYTStack,
    CameraTab: {
      screen: Camera,
      navigationOptions: () => ({
        headerTintColor: Colors.white,
        header: null,
        title: '',
        tabBarVisible: false,
        tabBarOnPress: ({ navigation }) => navigation.navigate('Camera')
      }),
    },
    Gallery: {
      screen: GalleryStack,
    },
    Upgrades: UpgradeStack,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        let iconName;

        switch (routeName) {
          case 'Home':
            iconName = focused ? activeHome : inactiveHome;
            break;
          case 'KYT':
            iconName = focused ? activeKyt : inactiveKyt;
            break;
          case 'Gallery':
            iconName = focused ? activeGallery : inactiveGallery;
            break;
          case 'Upgrades':
            iconName = focused ? activeUpgrade : inactiveUpgrade;
            break;
          default:
            iconName = camera;
        }

        return (
          <View style={iconName === camera && styles.cameraIconWrapper}>
            <FastImage
              source={iconName}
              style={iconName === camera ? styles.cameraIcon : styles.defaultIcon}
              resizeMode={FastImage.resizeMode.contain}
            />
          </View>
        );
      },
    }),
    tabBarOptions: {
      activeTintColor: Colors.base,
      inactiveTintColor: Colors.gray,
    },
  },
);

const AlbumStack = createStackNavigator({
  SiteGallery: {
    screen: SiteGallery,
  },
  DeviceImageGallery: {
    screen: DeviceImageGallery,
  }
});

const MainStack = createStackNavigator({
  AppTabs: {
    screen: AppTab,
    navigationOptions: {
      header: null
    }
  },
  Camera: {
    screen: Camera,
    navigationOptions: {
      headerTintColor: Colors.white,
      header: null,
    },
  },
  AlbumStack
},
{
  headerMode: 'none',
  mode: 'modal',
  transparentCard: true,
  cardStyle: { opacity: 1 }
});

export default createAppContainer(
  createSwitchNavigator(
    {
      Authenticate,
      App: MainStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'Authenticate',
    },
  ),
);
