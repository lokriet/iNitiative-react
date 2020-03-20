import React, { Fragment, useCallback } from 'react';


import { connect, useDispatch } from 'react-redux';
import Spinner from '../components/UI/Spinner/Spinner';
import { useHistory } from 'react-router-dom';
import * as actions from '../store/actions';

const withAuthCheck = WrappedComponent => {
  return connect(mapStateToProps)(props => {
    const dispatch = useDispatch();
    const history = useHistory();

    const handleLogin = useCallback(() => {
      console.log('auth check', history);
      dispatch(actions.setAuthRedirectPath(history.location.pathname + history.location.search));
      history.push('/login');
    }, [dispatch, history]);


    if (!props.initialAuthCheckDone) {
      return <Spinner />;
    } else if (!props.isAuthenticated && props.initialAuthCheckDone) {
      return (
        <div style={{width: 'fit-content', margin: 'auto'}}>
          <div>You are not logged in</div>
          <button type="button" onClick={handleLogin}>
            Login
          </button>
        </div>
      );
    } else {
      return <WrappedComponent {...props} />;
    }
  })
      
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.user != null,
    initialAuthCheckDone: state.auth.initialAuthCheckDone
  };
};

export default withAuthCheck;
