// AppStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen, RewardScreen, LocationScreen, MoreScreen, DetailScreen, LoginScreen, SignupScreen, MyOfferScreen } from '../screens';

const { Navigator, Screen } = createStackNavigator();

export const AppStack = () => {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen component={HomeScreen} name="HomeScreen" />
      <Screen component={MyOfferScreen} name="OfferScreen" />
      <Screen component={RewardScreen} name="RewardScreen" />
      <Screen component={LocationScreen} name="LocationScreen" />
      <Screen component={DetailScreen} name="DetailScreen" />
      <Screen component={MoreScreen} name="MoreScreen" />
      <Screen component={LoginScreen} name="LoginScreen" />
      <Screen component={SignupScreen} name="SignupScreen" />
    </Navigator>
  );
};
