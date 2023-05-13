import { createTheme } from '@mui/material/styles';

// Create a theme instance.
export const lightTheme = createTheme({
  palette: {
    primary: {
      main: '#543f30',
    },
    secondary: {
      main: '#19857b',
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
