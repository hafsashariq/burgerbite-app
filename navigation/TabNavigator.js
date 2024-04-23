import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useState, useEffect, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

import { AuthenticatedUserContext } from '../providers';
import { Colors, auth } from '../config';
import { MyOfferScreen, RewardScreen } from '../screens';
import { Icon } from '../components';
import { AuthStack, AppStack, MoreAppStack } from '../navigation';

// Create bottom tab navigator
const Tab = createBottomTabNavigator();
export const TabNavigator = () => {
    const { user, setUser } = useContext(AuthenticatedUserContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // onAuthStateChanged returns an unsubscriber
        const unsubscribeAuthStateChanged = onAuthStateChanged(
            auth,
            authenticatedUser => {
                setUser(authenticatedUser);
                setIsLoading(false);
            }
        );

        // unsubscribe auth listener on unmount
        return unsubscribeAuthStateChanged;
    }, [setUser]);

    // Decide which stack to show based on user authentication status
    const getTabScreen = () => {
        console.log('user object', user)
        if (isLoading) {
            return null; // You might want to show a loading indicator here
        }

        return (
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: Colors.orange,
                    tabBarInactiveTintColor: Colors.mediumGray,
                }}
            >
                <Tab.Screen name="Home" component={AppStack} options={{
                    tabBarLabel: 'HOME',
                    tabBarActiveTintColor: Colors.orange,
                    tabBarInactiveTintColor: Colors.mediumGray,
                    tabBarIcon: ({ focused }) => (
                        <Icon name={focused ? "home" : "home-outline"} color={Colors.yellow} size={28}
                            style={{ marginRight: 0 }} />
                    ),
                }} />
                <Tab.Screen name="Offers" component={user ? MyOfferScreen : AuthStack} options={{
                    tabBarLabel: 'OFFERS',
                    tabBarActiveTintColor: Colors.orange,
                    tabBarInactiveTintColor: Colors.mediumGray,
                    tabBarIcon: ({focused}) => (
                        <Icon name={focused ? "wallet" : "wallet-outline"} color={Colors.yellow} size={28}
                            style={{ marginRight: 0 }} />
                    ),
                }} />
                <Tab.Screen name="Rewards" component={user ? RewardScreen : AuthStack} options={{
                    tabBarLabel: 'REWARDS',
                    tabBarActiveTintColor: Colors.orange,
                    tabBarInactiveTintColor: Colors.mediumGray,
                    tabBarIcon: ({focused}) => (
                        <Icon name={focused ? "gift" : "gift-outline"} color={Colors.yellow} size={28}
                            style={{ marginRight: 0 }} />
                    ),
                }} />
                <Tab.Screen name="More"
                    children={() => <MoreAppStack user={user} />}
                options={{
                    tabBarLabel: 'MORE',
                    tabBarActiveTintColor: Colors.orange,
                    tabBarInactiveTintColor: Colors.mediumGray,
                    tabBarIcon: ({focused}) => (
                        <Icon name={"dots-horizontal" } color={Colors.yellow} size={28}
                            style={{ marginRight: 0 }} />
                    ),
                }} />
            </Tab.Navigator>
        );
    };

    return getTabScreen()
};
