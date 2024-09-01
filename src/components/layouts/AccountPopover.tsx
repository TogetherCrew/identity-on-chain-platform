import { MouseEvent, useState } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import {
  Avatar,
  IconButton,
  MenuItem,
  Popover,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';

function AccountPopover() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    console.log('User logged out');
    handleClose();
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        data-testid="account-popover-button"
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(anchorEl && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          <AccountCircleIcon
            sx={{
              width: 36,
              height: 36,
            }}
          />
        </Avatar>
      </IconButton>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          sx={{
            typography: 'body2',
            color: 'error.main',
            pb: 1,
            ':focus': {
              backgroundColor: 'error.light',
              color: 'contrastText',
            },
            ':active': {
              backgroundColor: 'error.light',
              color: 'white',
            },
          }}
          onClick={handleLogout}
        >
          <Typography variant="body2">
            <LogoutIcon sx={{ mr: 2 }} />
            Logout
          </Typography>
        </MenuItem>
      </Popover>
    </>
  );
}

export default AccountPopover;
