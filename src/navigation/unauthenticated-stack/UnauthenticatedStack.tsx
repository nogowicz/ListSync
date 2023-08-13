import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SCREENS } from '../utils/screens';
import WelcomeScreen from 'views/unauthenticated/welcome-screen';


export default function UnauthenticatedStack() {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator
            initialRouteName={SCREENS.UNAUTHENTICATED.WELCOME_SCREEN.ID}
            screenOptions={{
                animation: 'fade',
                headerShown: false,
            }}
        >
            <Stack.Screen
                name={SCREENS.UNAUTHENTICATED.WELCOME_SCREEN.ID}
                component={WelcomeScreen}
            />

        </Stack.Navigator>

    );
}

