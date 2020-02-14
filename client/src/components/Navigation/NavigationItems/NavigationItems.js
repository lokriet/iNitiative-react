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
    <div className={classes.NavigationItemsBar}>
      <ul className={classes.NavigationItems}>
        <NavigationItem link="/" exact>Home</NavigationItem>
        {props.isAdmin ? (
          <NavigationItem link="/admin">Admin</NavigationItem>
        ) : null}
        {props.isAuthenticated ? <NavigationItem link="/homebrew">Homebrew</NavigationItem> : null}
      </ul>
      <ul className={classes.NavigationItems}>
        {auth}
      </ul>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
    isAdmin: state.auth.user && state.auth.user.isAdmin
  };
};

export default connect(mapStateToProps)(NavigationItems);
