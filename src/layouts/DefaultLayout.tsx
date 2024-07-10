import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import SidebarApp from '@/components/layouts/SidebarApp';

function DefaultLayout() {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <SidebarApp />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          overflowX: 'hidden',
        }}
      >
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            px: 3,
            py: 2,
            backgroundColor: (theme) => theme.palette.grey[50],
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default DefaultLayout;
