import axios from 'axios';

import useSnackbarStore from '../../store/useSnackbarStore';

export const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  throw new Error(
    'VITE_API_BASE_URL is not defined in your environment variables'
  );
}

const apiInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiInstance.interceptors.request.use(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (config: any) => {
    const token = localStorage.getItem('OCI_TOKEN');
    if (token) {
      return {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        },
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { showSnackbar } = useSnackbarStore.getState();

    if (error.response?.status === 401) {
      localStorage.removeItem('OCI_TOKEN');
      showSnackbar('Session expired. Please log in again.', {
        severity: 'error',
        duration: 5000,
        position: { vertical: 'bottom', horizontal: 'right' },
      });
      window.location.href = '/auth/login';
    } else if (error.response?.status === 400) {
      showSnackbar(`${error.response.data.message.message[0]}`, {
        severity: 'warning',
        duration: 5000,
        position: { vertical: 'bottom', horizontal: 'right' },
      });
      window.location.href = '/auth/login';
    } else {
      showSnackbar('An unexpected error occurred.', {
        severity: 'error',
        duration: 5000,
        position: { vertical: 'bottom', horizontal: 'right' },
      });
    }

    return Promise.reject(error);
  }
);

export default apiInstance;
export { apiInstance as api };
