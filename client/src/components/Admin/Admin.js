import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import useAuthCheck from '../../hooks/useAuthCheck';

const Admin = props => {

  useAuthCheck(props);

  return props.isAuthenticated ? <div>I'm admin console</div> : null;
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token != null,
    initialAuthCheckDone: state.auth.initialAuthCheckDone
  };
};

Admin.propTypes = {};

export default connect(mapStateToProps)(Admin);
