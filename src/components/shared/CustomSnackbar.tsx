import { Snackbar, Alert, AlertTitle, Link, Box } from '@mui/material';
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
      autoHideDuration={options?.duration ?? 3000}
      open={open}
      onClose={closeSnackbar}
    >
      <Alert
        severity={options?.severity || 'info'}
        sx={{ width: '100%', display: 'flex', alignItems: 'center' }}
        variant="filled"
        onClose={closeSnackbar}
        icon={options?.icon}
        aria-live="assertive"
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box>
            <AlertTitle>{message}</AlertTitle>
            {options?.linkText && options?.linkUrl && (
              <Link href={options.linkUrl} color="inherit" underline="always">
                {options.linkText}
              </Link>
            )}
          </Box>
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
