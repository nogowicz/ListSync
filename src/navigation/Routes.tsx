import React from 'react';
import AuthenticatedStack from './authenticated-stack/AuthenticatedStack';
import { NavigationContainer } from '@react-navigation/native';
import UnauthenticatedStack from './unauthenticated-stack';
import { useUser } from 'context/UserProvider';


export default function Routes() {
    const { user, setUserDetails } = useUser();
    return (
        <NavigationContainer>
            {user ?
                <AuthenticatedStack /> :
                <UnauthenticatedStack />}
        </NavigationContainer>
    )
}