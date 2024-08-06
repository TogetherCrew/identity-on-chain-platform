import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useMemo,
} from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  jwt: string | null;
  setAuthInfo: (jwt: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [jwt, setJwt] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('OCI_TOKEN');
    if (token) {
      setJwt(token);
      setIsAuthenticated(true);
    }
  }, []);

  const setAuthInfo = (token: string) => {
    setJwt(token);
    setIsAuthenticated(true);
    localStorage.setItem('OCI_TOKEN', token);
  };

  const signOut = () => {
    setJwt(null);
    setIsAuthenticated(false);
    localStorage.removeItem('OCI_TOKEN');
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      jwt,
      setAuthInfo,
      signOut,
    }),
    [isAuthenticated, jwt]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
