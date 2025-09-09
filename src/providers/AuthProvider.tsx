import React from 'react';
import { User } from '@/types/user.types';
import { LoginCredentials, RegisterData } from '@/types/auth.types';

export interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login?: (credentials: LoginCredentials) => Promise<void>;
  logout?: () => void;
  register?: (data: RegisterData) => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextProps>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);

  React.useEffect(() => {
    // Implement logic to check if user is authenticated
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    // Implement login logic here
  };

  const register = async (data: RegisterData) => {
    // Implement register logic here
  };

  const logout = () => {
    // Implement logout logic here
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};
