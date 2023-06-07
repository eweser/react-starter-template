import type { Theme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';
import { Button, CssBaseline, IconButton } from '@mui/material';
import type { FC, PropsWithChildren } from 'react';
import { useState, useEffect, useContext, createContext } from 'react';
import { darkTheme, lightTheme } from './theme';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
export type ThemeType = 'dark' | 'light';

export const CustomThemeContext = createContext<ThemeContextProps>({
  themeType: 'light',
  toggleTheme: () => null,
});

export const CustomThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const { themeType, toggleTheme, theme } = useThemeToggle();
  return (
    <CustomThemeContext.Provider value={{ themeType, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </CustomThemeContext.Provider>
  );
};

const themeKey = 'color-theme';
const setLocalTheme = (themeType: ThemeType) =>
  window.localStorage.setItem(themeKey, themeType);
export const getLocalTheme = () =>
  window.localStorage.getItem(themeKey) as ThemeType | null;

export const useThemeToggle = () => {
  // Browser or system preference
  const prefersLightMode =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: light)').matches;

  // Manually set preference (last user-toggle)
  const localTheme = getLocalTheme();

  let initialTheme: ThemeType;
  if (localTheme) initialTheme = localTheme;
  else if (prefersLightMode) initialTheme = 'light';
  else initialTheme = 'dark';

  const [themeType, setThemeType] = useState<ThemeType>(initialTheme);
  const [theme, setTheme] = useState<Theme>(
    initialTheme === 'dark' ? darkTheme : lightTheme
  );

  const toggleTheme = () => {
    if (themeType === 'light') {
      setLocalTheme('dark');
      setThemeType('dark');
      setTheme(darkTheme);
    } else {
      setLocalTheme('light');
      setThemeType('light');
      setTheme(lightTheme);
    }
  };

  useEffect(() => {
    setThemeType(initialTheme);
  }, [initialTheme]);
  return { theme, themeType, toggleTheme };
};

export interface ThemeContextProps {
  themeType: ThemeType;
  toggleTheme: () => void;
}

export const ThemeToggleButton = () => {
  const { themeType, toggleTheme } = useContext(CustomThemeContext);
  const themeLabel = themeType === 'dark' ? 'Light theme' : 'Dark theme';
  return (
    <Button
      onClick={toggleTheme}
      sx={{
        display: 'flex',
        alignItems: 'center',
        color: 'text.primary',
        px: 2,
      }}
    >
      <IconButton sx={{ mr: 2 }} color="inherit">
        {themeType === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>

      {themeLabel}
    </Button>
  );
};
