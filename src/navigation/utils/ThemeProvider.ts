import { createContext, useContext } from 'react';

interface ThemeContextType {
  PRIMARY: string;
  SECONDARY: string;
  TEXT: string;
  BACKGROUND: string;
  HINT: string;
  LIGHT_HINT: string;
  GREEN: string;
  YELLOW: string;
  RED: string;
  ERROR: string;
  FIXED_DARK_TEXT: string;
  FIXED_PRIMARY_BLUE: string;
  FIXED_COMPONENT_COLOR: string;
  ADD_BUTTON_BACKGROUND: string;
  ADD_BUTTON_TEXT: string;
  WHITE: string;
  BOTTOM_SHEET_BACKGROUND: string;
  DARK_RED: string;
}

export const ThemeContext = createContext<ThemeContextType>(
  {} as ThemeContextType,
);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
