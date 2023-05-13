import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

import { ThemeProvider } from '@mui/material/styles';
import theme from './theme.tsx';
import CssBaseline from '@mui/material/CssBaseline';

import './index.css';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
