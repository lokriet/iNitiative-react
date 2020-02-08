import React, { Fragment } from 'react';
import { connect } from 'react-redux';

const Home = props => {
  return (
    <Fragment>
      <div>
        {props.isAuthenticated
          ? `You are logged in as ${props.user.username} (${props.user.email})`
          : 'You are not logged in'}
      </div>
      {props.isAuthenticated ? null : <a href='/register'>Register</a>}
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
