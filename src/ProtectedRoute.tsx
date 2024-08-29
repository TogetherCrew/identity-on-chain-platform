import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import { useAccount } from 'wagmi';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const { isConnected } = useAccount();

  useEffect(() => {
    if (!isConnected) {
      setIsAuthenticated(false);
      localStorage.removeItem('OCI_TOKEN');
    }
  }, [isConnected]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('OCI_TOKEN');
      if (token) {
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  if (loading) {
    return (
      <Backdrop open={loading} style={{ zIndex: 1201 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
