import React from 'react';
import AuthenticatedStack from './authenticated-stack/AuthenticatedStack';
import { NavigationContainer } from '@react-navigation/native';
import UnauthenticatedStack from './unauthenticated-stack';
import { useUser } from 'context/UserProvider';
import { useAuth } from 'context/AuthContext';


export default function Routes() {
    // const { user, setUserDetails } = useUser();
    const { user } = useAuth();
    return (
        <NavigationContainer>
            {user ?
                <AuthenticatedStack /> :
                <UnauthenticatedStack />}
        </NavigationContainer>
    )
}