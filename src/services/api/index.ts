import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbarStore();
    if (error.response?.status === 400) {
      showSnackbar('Bad Request', {
        severity: 'error',
      });
    }

    if (error.response?.status === 401) {
      // Show the snackbar message
      showSnackbar('Session expired. Please log in again.', {
        severity: 'warning',
      });

      // Redirect the user to the login page
      navigate('/auth/login');
    }

    return Promise.reject(error);
  }
);

export default apiInstance;
export { apiInstance as api };
