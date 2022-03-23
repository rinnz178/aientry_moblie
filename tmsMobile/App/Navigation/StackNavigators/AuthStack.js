import {
  createStackNavigator,
  StackViewTransitionConfigs,
} from 'react-navigation-stack';
import Login from '../../Containers/Login/Login';
import Register1 from '../../Containers/Login/Register_Page_1';
import Register2 from '../../Containers/Login/Register_Page_2';

const AuthStack = createStackNavigator(
  {
    Login,
    Register1,
    Register2: {
      screen: Register2,
      navigationOptions: () => ({
        headerTransparent: true,
      }),
    }
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
    transitionConfig: () => StackViewTransitionConfigs.SlideFromRightIOS,
    defaultNavigationOptions: {
      gesturesEnabled: true
    }
  },
);

export default AuthStack;
