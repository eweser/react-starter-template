import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

import { CustomThemeProvider } from './ThemeContext.tsx';

import './index.css';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { DatabaseProvider } from './DatabaseContext.tsx';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <CustomThemeProvider>
      <DatabaseProvider>
        <App />
      </DatabaseProvider>
    </CustomThemeProvider>
  </React.StrictMode>
);
