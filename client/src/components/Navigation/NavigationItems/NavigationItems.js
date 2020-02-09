import React, { Fragment } from 'react';
import classes from './NavigationItems.module.css';
import NavigationItem from './NavigationItem/NavigationItem';
import { connect } from 'react-redux';

const NavigationItems = props => {
  const auth = props.isAuthenticated ? (
    <NavigationItem link="/logout">Logout</NavigationItem>
  ) : (
    <Fragment>
      <NavigationItem link="/login">Login</NavigationItem>
      <NavigationItem link="/register">Register</NavigationItem>
    </Fragment>
  );

  return (
    <ul className={classes.NavigationItems}>
      <NavigationItem link="/">Home</NavigationItem>
      {props.isAuthenticated ? (
        <NavigationItem link="/admin">Admin</NavigationItem>
      ) : null}
      {auth}
    </ul>
  );
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  };
};

export default connect(mapStateToProps)(NavigationItems);
