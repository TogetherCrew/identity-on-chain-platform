import { AppBar, Box, Toolbar } from '@mui/material';
import { ConnectButton } from '@rainbow-me/rainbowkit';

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
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <ConnectButton />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default AppbarApp;
