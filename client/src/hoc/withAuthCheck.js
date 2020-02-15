import React, { Fragment, useCallback } from 'react';

import { connect, useDispatch } from 'react-redux';
import Spinner from '../components/UI/Spinner/Spinner';
import { useRouteMatch, useHistory } from 'react-router-dom';
import * as actions from '../store/actions';

const withAuthCheck = (WrappedComponent) => {
  return connect(mapStateToProps)(props => {
    const dispatch = useDispatch();
    const {path} = useRouteMatch();
    const history = useHistory();

    const handleLogin = useCallback(
      () => {
        dispatch(actions.setAuthRedirectPath(path));
        history.push('/login');
      },
      [dispatch, path, history],
    )

    if (!props.initialAuthCheckDone) {
      return <Spinner />;
    } else if (!props.isAuthenticated && props.initialAuthCheckDone) {
      return (
        <Fragment>
          <div>You are not logged in</div>
          <button type="button" onClick={handleLogin}>Login</button>
        </Fragment>
      );
    } else {
      return <WrappedComponent {...props} />
    }
  });
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token != null,
    initialAuthCheckDone: state.auth.initialAuthCheckDone
  };
};

export default withAuthCheck;
