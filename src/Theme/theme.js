import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  typography: {
    fontFamily: '"Rubik", sans-serif',
    htmlFontSize: 10, 

  
    h1: {
      fontFamily: '"Rubik", sans-serif',
      fontSize: '34px',  
      lineHeight: '40px', 
      fontWeight: 300,    
    },
    h2: {
      fontFamily: '"Rubik", sans-serif',
      fontSize: '26px',   
      lineHeight: '36px', 
      fontWeight: 300,    
    },
    h3: {
      fontFamily: '"Rubik", sans-serif',
      fontSize: '22px',   
      lineHeight: '32px', 
      fontWeight: 400,    
    },
    h4: {
      fontFamily: '"Rubik", sans-serif',
      fontSize: '18px',  
      lineHeight: '26px', 
      fontWeight: 400,    
    },

    // Body text
    body1: {
      fontSize: '16px',   
      lineHeight: '24px',
      fontWeight: 400,   
    },
    body2: {
      fontSize: '14px',   
      lineHeight: '20px',
      fontWeight: 400,    
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: '14px',   // Google Material button text
          fontWeight: 500,    // Medium
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& input': {
            fontSize: '16px', // standard input font size
            fontWeight: 400,
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
    fontSize: '10px',
  },
  'body': {
    fontFamily: '"Rubik", sans-serif',
    fontSize: '16px',
    fontWeight: 400,
  },
};
