
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Login from '../components/Login';
import MainApp from '../components/MainApp';

const Index = () => {
  const { currentUser } = useAuth();

  return currentUser ? <MainApp /> : <Login />;
};

export default Index;
