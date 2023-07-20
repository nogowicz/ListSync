import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../../views/authenticated/Home';
import { SCREENS } from '../utils/screens';

export default function AuthentricatedStack() {
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
        </Stack.Navigator>
    );
}

