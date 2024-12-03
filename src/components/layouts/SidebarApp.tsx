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
import theme from '../../libs/theme';

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
        <List sx={{ padding: 2 }}>
          {' '}
          {SIDEBAR_MENU.map((item) => (
            <ListItemButton
              key={item.title}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 1,
                mt: 1,
                padding: '8px 16px',
                borderRadius: 2,
                backgroundColor:
                  item.path === pathname
                    ? theme.palette.primary.main
                    : 'transparent',
                color:
                  item.path === pathname
                    ? theme.palette.primary.contrastText
                    : theme.palette.text.primary,
                '&:hover': {
                  backgroundColor:
                    item.path === pathname
                      ? theme.palette.primary.main // Keep the same background for selected item
                      : theme.palette.action.hover,
                },
                '&.Mui-selected': {
                  backgroundColor: `${theme.palette.primary.main} !important`,
                  color: theme.palette.primary.contrastText,
                  '&:hover': {
                    backgroundColor: `${theme.palette.primary.main} !important`, // Prevent hover effect from altering the background
                  },
                },
              }}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon
                sx={{
                  minWidth: 'auto',
                  color:
                    item.path === pathname
                      ? theme.palette.primary.contrastText
                      : theme.palette.text.primary,
                }}
              >
                <item.icon />
              </ListItemIcon>
              <ListItemText
                primary={item.title}
                sx={{
                  color: 'inherit',
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}

export default SidebarApp;
