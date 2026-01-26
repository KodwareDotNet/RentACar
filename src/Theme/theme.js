import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  typography: {
    fontFamily: '"Rubik", sans-serif',
    htmlFontSize: 10,
    h1: {
      fontFamily: '"Poppins", sans-serif',
      fontSize: '5.2rem',
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: '"Poppins", sans-serif',
      fontSize: '4.2rem',
      lineHeight: 1.3,
    },
    h3: {
      fontFamily: '"Poppins", sans-serif',
      fontSize: '2.4rem',
      lineHeight: 1.4,
    },
    h4: {
      fontFamily: '"Poppins", sans-serif',
      fontSize: '2.2rem',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1.6rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '1.4rem',
      lineHeight: 1.6,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: '1.6rem',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& input': {
            fontSize: '1.4rem',
          },
        },
      },
    },
  },
});

export const globalStyles = {
  '*': {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  },
  'html': {
    fontSize: '62.5%',
  },
  'body': {
    fontFamily: '"Rubik", sans-serif',
    fontSize: '1.6rem',
  },
};