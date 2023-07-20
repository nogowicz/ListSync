import React from 'react';
import AuthenticatedStack from './AuthenticatedStack';
import { NavigationContainer } from '@react-navigation/native';

export default function Routes() {
    return (
        <NavigationContainer>
            <AuthenticatedStack />
        </NavigationContainer>
    )
}