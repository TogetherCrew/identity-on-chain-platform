import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

import { DRAWER_WIDTH, SIDEBAR_MENU } from '../../libs/constants';

function SidebarApp() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <Box display="flex">
      <Drawer
        data-testid="drawer_app"
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              LogID
            </Typography>
          </Box>
        </Toolbar>
        <Divider />
        <List>
          {SIDEBAR_MENU.map((item) => (
            <ListItemButton
              key={item.title}
              sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}
              selected={item.path === pathname}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon sx={{ minWidth: 'auto' }}>
                <item.icon />
              </ListItemIcon>
              <ListItemText>{item.title}</ListItemText>
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}

export default SidebarApp;
