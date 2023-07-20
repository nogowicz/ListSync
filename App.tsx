import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  useColorScheme,
} from 'react-native';
import Routes from './src/navigation/Routes';
import { ThemeContext } from './src/navigation/utils/ThemeProvider';
import { theme } from './src/styles/colors';
import LangContext, { LangModeProvider } from './src/lang/LangProvider';

export default function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [themeMode, setThemeMode] = useState(false);
  return (

    <ThemeContext.Provider value={themeMode ? theme.dark : theme.light}>
      <SafeAreaView>
        <StatusBar
          backgroundColor={themeMode ? '#000000' : '#F9F9F9'}
          barStyle={themeMode ? 'light-content' : 'dark-content'}
        />
        <LangModeProvider>
          <LangContext>
            <Routes />
          </LangContext>
        </LangModeProvider>
      </SafeAreaView>
    </ThemeContext.Provider>


  );
}

