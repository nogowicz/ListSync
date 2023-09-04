import React, { useEffect } from 'react';
import AuthenticatedStack from './authenticated-stack/AuthenticatedStack';
import { NavigationContainer } from '@react-navigation/native';
import UnauthenticatedStack from './unauthenticated-stack';
import { useAuth } from 'context/AuthContext';
import { getItem } from 'utils/asyncStorage';


export default function Routes() {
    const { user, setUser } = useAuth();

    useEffect(() => {
        (async function getUserFromAsyncStorage() {
            const userFromAsyncStorage = await getItem('user');

            if (userFromAsyncStorage) {
                setUser(JSON.parse(userFromAsyncStorage));
            }

        })();
    }, []);


    return (
        <NavigationContainer>
            {user ?
                <AuthenticatedStack /> :
                <UnauthenticatedStack />}
        </NavigationContainer>
    )
}