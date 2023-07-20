import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../../views/authenticated/home';
import { SCREENS } from '../utils/screens';
import List from 'views/authenticated/list';
import { View } from 'react-native';

export default function AuthenticatedStack() {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator
            initialRouteName={SCREENS.AUTHENTICATED.HOME.ID}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name={SCREENS.AUTHENTICATED.HOME.ID}
                component={Home}
            />

            <Stack.Screen
                name={SCREENS.AUTHENTICATED.LIST.ID}
                component={List}
            />
        </Stack.Navigator>

    );
}

