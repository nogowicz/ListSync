import { createContext } from 'react';

interface ThemeContextType {
  PRIMARY: string;
  SECONDARY: string;
  TERTIARY: string;
  TEXT: string;
  BACKGROUND: string;
  HINT: string;
  LIGHT_HINT: string;
  GREEN: string;
  YELLOW: string;
  RED: string;
}

export const ThemeContext = createContext<ThemeContextType>(
  {} as ThemeContextType,
);
