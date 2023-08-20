import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../../views/authenticated/home';
import { SCREENS } from '../utils/screens';
import List from 'views/authenticated/list';
import Profile from 'views/authenticated/profile';

export default function AuthenticatedStack() {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator
            initialRouteName={SCREENS.AUTHENTICATED.HOME.ID}
            screenOptions={{
                animation: 'fade',
                headerShown: false,
            }}
        >
            <Stack.Screen
                name={SCREENS.AUTHENTICATED.HOME.ID}
                component={Home}
            />

            <Stack.Screen
                name={SCREENS.AUTHENTICATED.LIST.ID}
                //@ts-ignore
                component={List}
            />
            <Stack.Screen
                name={SCREENS.AUTHENTICATED.PROFILE.ID}
                component={Profile}
            />
        </Stack.Navigator>

    );
}

