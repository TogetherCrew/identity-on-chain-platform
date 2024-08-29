import { SnackbarOrigin } from '@mui/material';
import { create } from 'zustand';

interface SnackbarState {
  message: string;
  open: boolean;
  options?: SnackbarOptions;
  showSnackbar: (message: string, options?: SnackbarOptions) => void;
  closeSnackbar: () => void;
}

interface SnackbarOptions {
  severity?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  position?: SnackbarOrigin;
}

const useSnackbarStore = create<SnackbarState>((set) => ({
  message: '',
  open: false,
  options: {
    severity: 'info',
    duration: 3000,
    position: { vertical: 'bottom', horizontal: 'right' },
  },
  showSnackbar: (message, options) =>
    set({
      message,
      open: true,
      options: {
        ...options,
        position: { vertical: 'bottom', horizontal: 'right' },
      },
    }),
  closeSnackbar: () => set({ open: false }),
}));

export default useSnackbarStore;
