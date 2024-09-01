import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4200FF',
    },
  },
  typography: {
    fontFamily: ['DM Sans', 'sans-serif'].join(','),
  },
});

export default theme;
