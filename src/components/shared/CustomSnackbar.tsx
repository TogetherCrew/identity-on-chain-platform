import { Snackbar, Alert } from '@mui/material';

import useSnackbarStore from '../../store/useSnackbarStore';

/**
 * CustomSnackbar component displays a Snackbar using Material-UI's Snackbar component.
 * It uses Zustand store for managing Snackbar state globally.
 *
 * @returns {JSX.Element} The rendered CustomSnackbar component.
 */
export const CustomSnackbar = (): JSX.Element => {
  const { message, open, options, closeSnackbar } = useSnackbarStore();

  return (
    <Snackbar
      anchorOrigin={
        options?.position || { vertical: 'bottom', horizontal: 'right' }
      }
      autoHideDuration={options?.duration}
      open={open}
      onClose={closeSnackbar}
    >
      <Alert
        severity={options?.severity || 'info'}
        sx={{ width: '100%' }}
        variant="filled"
        onClose={closeSnackbar}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
