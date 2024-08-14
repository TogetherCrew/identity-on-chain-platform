import axios from 'axios';

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

export default apiInstance;
export { apiInstance as api };
