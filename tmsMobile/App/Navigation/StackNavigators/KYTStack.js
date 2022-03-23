import React from 'react';
import {
  createStackNavigator,
  StackViewTransitionConfigs,
} from 'react-navigation-stack';
import defaultNavigationOptions from '../NavigationOptions';
import KYTSet from '../../Containers/KYT/Set';
import KYTCategory from '../../Containers/KYT/Category';
import AddQuestion from '../../Containers/KYT/AddQuestion';
import Question from '../../Containers/KYT/Question';
import { HeaderBackButton } from '../../Components';
import trans from '../../Translations/Trans';

const KYTStack = createStackNavigator(
  {
    KYTSet: {
      screen: KYTSet,
      navigationOptions: {
        ...defaultNavigationOptions,
        headerRight: null,
        headerTitle: trans('kytSetScreenTitle'),
      },
    },
    KYTCategory: {
      screen: KYTCategory,
      navigationOptions: ({ navigation }) => ({
        ...defaultNavigationOptions,
        headerTitle: trans('kytCategoryScreenTitle'),
        headerLeft: <HeaderBackButton onPress={() => navigation.goBack()} />,
      }),
    },
    KYTQuestion: {
      screen: Question,
      navigationOptions: ({ navigation }) => ({
        ...defaultNavigationOptions,
        headerTitle: trans('questionScreenTitle'),
        headerLeft: <HeaderBackButton onPress={() => navigation.goBack()} />,
      }),
    },
    AddQuestion: {
      screen: AddQuestion,
    },
  },
  {
    transitionConfig: (currentState) => {
      if (
        currentState.scenes[
          currentState.scenes.length - 1
        ].route.routeName.includes('KYT')
      ) {
        return StackViewTransitionConfigs.SlideFromRightIOS;
      }
      return null;
    },
    headerMode: 'float',
  },
);

/* hide bottom tab bar if the current route or screen is KYT Questions */
KYTStack.navigationOptions = ({ navigation }) => ({
  tabBarVisible: navigation.state.index < 2,
});

export default KYTStack;
