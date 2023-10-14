import React, { useEffect, useLayoutEffect } from 'react';
import AuthenticatedStack from './authenticated-stack/AuthenticatedStack';
import { NavigationContainer } from '@react-navigation/native';
import UnauthenticatedStack from './unauthenticated-stack';
import { useAuth } from 'context/AuthContext';
import { getItem } from 'utils/asyncStorage';
import SplashScreen from 'react-native-splash-screen';


export default function Routes() {
    const { user, setUser } = useAuth();

    useLayoutEffect(() => {
        (async function getUserFromAsyncStorage() {
            const userFromAsyncStorage = await getItem('user');
            if (userFromAsyncStorage) {
                setUser(JSON.parse(userFromAsyncStorage));
            }
            SplashScreen.hide();
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