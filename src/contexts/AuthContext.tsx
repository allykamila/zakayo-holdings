
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, users } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  canAccess: (subsidiaryId: number) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('zakayo-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('zakayo-user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('zakayo-user');
    }
  }, [currentUser]);

  const login = (email: string, password: string): boolean => {
    // Mock authentication - in real app, this would be an API call
    const user = users.find(u => u.email === email);
    if (user && password === 'password123') { // Mock password
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const canAccess = (subsidiaryId: number): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'Owner') return true;
    return currentUser.subsidiaryId === subsidiaryId;
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, canAccess }}>
      {children}
    </AuthContext.Provider>
  );
};
