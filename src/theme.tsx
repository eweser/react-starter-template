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
    background: {
      default: '#FAF9F8',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E1E1E',
      secondary: '#7A8386',
      disabled: '#B4B9BB',
    },
    grey: {
      '200': '#EEEEEE',
      '300': '#E0E0E0',
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#613e27',
    },
    secondary: {
      main: '#19857b',
    },
    background: {
      default: '#2D2D2D',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#EEEEEE',
      secondary: '#B4B9BB',
      disabled: '#4B4B4B',
    },
    grey: {
      '200': '#3A3A3A',
      '300': '#E0E0E0',
    },
  },
});
