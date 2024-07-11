import { AppBar, Box, Toolbar } from '@mui/material';

function AppbarApp() {
  return (
    <Box>
      <AppBar
        data-testid="Appbar"
        position="static"
        elevation={0}
        variant="outlined"
        color="inherit"
        sx={{
          borderLeft: 0,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          backgroundColor: 'crystal.main',
        }}
      >
        <Toolbar>skj</Toolbar>
      </AppBar>
    </Box>
  );
}

export default AppbarApp;
