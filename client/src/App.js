import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { authCheckInitialState } from './components/Auth/authSlice';

import Layout from './components/UI/Layout/Layout';
import Spinner from './components/UI/Spinner/Spinner';
import Routes from './Routes';

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth.token != null);
  const { initialAuthCheckDone } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated && !initialAuthCheckDone) {
      dispatch(authCheckInitialState());
    }
  }, [isAuthenticated, initialAuthCheckDone, dispatch]);

  return initialAuthCheckDone ? (
    <BrowserRouter>
      <Layout>
        <Routes />
      </Layout>
    </BrowserRouter>
  ) : (
    <Spinner />
  );
};

export default App;
