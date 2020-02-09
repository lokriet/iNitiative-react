import React, { Fragment } from 'react';
import { connect, useDispatch } from 'react-redux';
import * as actions from '../../store/actions/index';
import { Link } from 'react-router-dom';

const Home = props => {
  const dispatch = useDispatch();
  return (
    <Fragment>
      <div>
        {props.isAuthenticated
          ? `You are logged in as ${props.user.username} (${props.user.email})`
          : 'You are not logged in'}
      </div>
      {props.isAuthenticated ? 
        <button onClick={() => dispatch(actions.logout())}>Logout</button>
      : <div><Link to='/register'>Register</Link> <Link to='/login'>Login</Link></div>}
      <Link to='/admin'>Admin console</Link>
    </Fragment>
  );
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token != null,
    user: state.auth.user
  };
};

export default connect(mapStateToProps)(Home);
