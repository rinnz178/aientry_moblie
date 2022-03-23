import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import LinearGradient from 'react-native-linear-gradient';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import Dashboard from '../../Containers/Dashboard/Dashboard';
import UserGuide from '../../Containers/UserGuide/UserGuide';
import Colors from '../../Themes';

const HomeStack = createStackNavigator(
  {
    Dashboard: {
      screen: Dashboard,
      navigationOptions: {
        headerBackground: (
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            colors={Colors.baseColorGradient}
          />
        ),
        headerStyle: {
          height: responsiveHeight(0),
          backgroundColor: Colors.base,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        }
      }
    },
    UserGuide: {
      screen: UserGuide,
      navigationOptions: {
        header: null
      }
    },
  },
  {
    mode: 'modal',
    navigationOptions: {
      headerVisible: true,
    },
  },
);

/* hide bottom tab bar if the current route or screen is User Guide */
HomeStack.navigationOptions = ({ navigation }) => ({
  tabBarVisible: navigation.state.index === 0,
});


export default HomeStack;
