import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { runAuthBootstrap } from '../../utils/authBootstrapper';
import { showBlockingLoader, hideBlockingLoader } from '../../store/uiSlice';

const AutoLogin = ({ children }) => {
  const dispatch = useDispatch();
  const isInitialized = useSelector((state) => state.auth.isInitialized);

  useEffect(() => {
    if (!isInitialized) {
      dispatch(showBlockingLoader('Authenticating...'));
      dispatch(runAuthBootstrap());
    } else {
      dispatch(hideBlockingLoader());
    }
  }, [dispatch, isInitialized]);

  if (!isInitialized) {
    return null;
  }

  return <>{children}</>;
};

export default AutoLogin;
