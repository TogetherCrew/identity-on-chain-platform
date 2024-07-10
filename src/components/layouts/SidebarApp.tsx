import { Drawer, List, ListItem, ListItemText } from '@mui/material';
import { DRAWER_WIDTH } from '../../libs/constants';

function SidebarApp() {
  return (
    <div>
      <Drawer
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
        <List>
          <ListItem button>
            <ListItemText primary="Item 1" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Item 2" />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}

export default SidebarApp;
