import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SCREENS } from '../utils/screens';
import WelcomeScreen from 'views/unauthenticated/welcome-screen';
import SignInScreen from 'views/unauthenticated/sign-in-screen';


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

            <Stack.Screen
                name={SCREENS.UNAUTHENTICATED.SING_IN_SCREEN.ID}
                component={SignInScreen}
            />

        </Stack.Navigator>

    );
}

