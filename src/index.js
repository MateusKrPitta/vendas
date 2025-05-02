import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import App from './App';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0d2d43',
    },
    segundary:{
      main: '#588152'
    },
    terciary:{
      main: '#ffffff'
    },
    new:{
      main: '#d2d7db'
    },

    customGray: {
      main: '#b0d847',
    },
  },
  typography: {
    fontFamily: '"Montserrat", sans-serif',
    fontSize: 12, 
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            fontSize: '12px',
          },
        },
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);
