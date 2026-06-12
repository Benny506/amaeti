import React from 'react';
import { useSelector } from 'react-redux';
import AccessDenied from './AccessDenied';

const ProtectedRoute = ({ children }) => {
  const { user, profile } = useSelector((state) => state.auth);

  if (!user || !profile) {
    return <AccessDenied />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
