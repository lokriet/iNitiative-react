import React, { useCallback } from 'react';

import {  useDispatch, useSelector } from 'react-redux';
import Spinner from '../components/UI/Spinner/Spinner';
import { useHistory } from 'react-router-dom';
import { setAuthRedirectPath } from '../components/Auth/authSlice';

const withAuthCheck = (WrappedComponent) => {
  return (props) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const isAuthenticated = useSelector(state => state.auth.token != null);
    const initialAuthCheckDone = useSelector(state => state.auth.initialAuthCheckDone);

    const handleLogin = useCallback(() => {
      dispatch(
        setAuthRedirectPath(history.location.pathname + history.location.search)
      );
      history.push('/login');
    }, [dispatch, history]);

    if (!initialAuthCheckDone) {
      return <Spinner />;
    } else if (!isAuthenticated && initialAuthCheckDone) {
      return (
        <div style={{ width: 'fit-content', margin: 'auto' }}>
          <div>You are not logged in</div>
          <button type="button" onClick={handleLogin}>
            Login
          </button>
        </div>
      );
    } else {
      return <WrappedComponent {...props} />;
    }
  };
};

export default withAuthCheck;
