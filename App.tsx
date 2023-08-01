import React, { useState } from 'react';
import {
  StatusBar,
  View,
  useColorScheme,
} from 'react-native';
import Routes from './src/navigation/Routes';
import { ThemeContext } from './src/navigation/utils/ThemeProvider';
import { theme } from './src/styles/colors';
import LangContext, { LangModeProvider } from './src/lang/LangProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DataProvider } from 'context/DataProvider';

export default function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [themeMode, setThemeMode] = useState(false);
  return (
    <ThemeContext.Provider value={themeMode ? theme.dark : theme.light}>
      <StatusBar
        backgroundColor={themeMode ? '#000000' : '#F9F9F9'}
        barStyle={themeMode ? 'light-content' : 'dark-content'}
      />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <LangModeProvider>
          <DataProvider>
            <LangContext>
              <Routes />
            </LangContext>
          </DataProvider>
        </LangModeProvider>
      </GestureHandlerRootView>
    </ThemeContext.Provider >


  );
}

