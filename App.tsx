import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  Appearance,
  StatusBar,
} from 'react-native';
import Routes from './src/navigation/Routes';
import { ThemeContext } from './src/navigation/utils/ThemeProvider';
import { theme } from './src/styles/colors';
import LangContext, { LangModeProvider } from './src/lang/LangProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DataProvider } from 'context/DataProvider';
import { getItem } from 'utils/asyncStorage';
import { EventRegister } from 'react-native-event-listeners';
import { AuthProvider } from 'context/AuthContext';
import { useNotification } from 'hooks/useNotification';



export default function App(): JSX.Element {
  const colorScheme = Appearance.getColorScheme();
  const [themeMode, setThemeMode] = useState(false);
  const { checkNotificationPermission } = useNotification();

  useLayoutEffect(() => {
    async function fetchTheme() {
      try {
        await getItem('theme').then((storedTheme) => {
          const storedThemeAsBoolean = JSON.parse(storedTheme as string);
          const initialThemeMode = storedTheme !== null ? storedThemeAsBoolean : (colorScheme === "dark" ? true : false);
          setThemeMode(initialThemeMode);
        });

      } catch (error) {
        console.error('Error fetching theme:', error);
      }
    }
    checkNotificationPermission();
    fetchTheme();
  }, []);


  useLayoutEffect(() => {
    let eventListener = EventRegister.addEventListener(
      "changeTheme",
      (theme: boolean) => {
        setThemeMode(theme);
      }
    );

    return () => {
      if (typeof eventListener === 'string') {
        EventRegister.removeEventListener(eventListener);
      }
    };
  }, []);

  return (
    <ThemeContext.Provider value={themeMode ? theme.dark : theme.light}>
      <StatusBar
        backgroundColor={themeMode ? '#000000' : '#F9F9F9'}
        barStyle={themeMode ? 'light-content' : 'dark-content'}
      />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <LangModeProvider>
          <AuthProvider>
            <LangContext>
              <DataProvider>
                <Routes />
              </DataProvider>
            </LangContext>
          </AuthProvider>
        </LangModeProvider>
      </GestureHandlerRootView>
    </ThemeContext.Provider >


  );
}

