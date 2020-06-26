import React, { Fragment } from 'react';
import classes from './NavigationItems.module.css';
import NavigationItem from './NavigationItem/NavigationItem';
import { useSelector } from 'react-redux';
import Popup from 'reactjs-popup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { selectIsAuthenticated, selectIsAdmin } from '../../Auth/authSlice';

const NavigationItems = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);

  const auth = isAuthenticated ? (
    <NavigationItem link="/logout">Logout</NavigationItem>
  ) : (
    <Fragment>
      <NavigationItem link="/login">Login</NavigationItem>
      <NavigationItem link="/register">Register</NavigationItem>
    </Fragment>
  );

  const mainNavItems = (
    <>
      <NavigationItem link="/" exact>
        Home
      </NavigationItem>
      {isAdmin ? (
        <NavigationItem link="/admin">Admin</NavigationItem>
      ) : null}
      {isAuthenticated ? (
        <>
          <NavigationItem link="/homebrew">Homebrew</NavigationItem>
          <NavigationItem link="/templates">Characters</NavigationItem>
          <NavigationItem link="/encounters">Encounters</NavigationItem>
          <NavigationItem link="/discuss">Discuss</NavigationItem>
        </>
      ) : null}
    </>
  );

  return (
    <div className={classes.NavigationItemsBar}>
      <ul className={`${classes.NavigationItems} ${classes.NarrowScreenNav}`}>
        <Popup
          on="hover"
          trigger={open => (
            <div className={classes.HamburgerIcon}>
              <FontAwesomeIcon icon={faBars} />
            </div>
          )}
          position="bottom left"
          arrow={false}
          offsetY={15}
          offsetX={-24}
        >
          <ul className={classes.SideNavigation}>
            {mainNavItems}
            {auth}
          </ul>
        </Popup>
      </ul>

      <ul className={`${classes.NavigationItems} ${classes.WideScreenNav}`}>
        {mainNavItems}
      </ul>
      <ul className={`${classes.NavigationItems} ${classes.WideScreenNav}`}>
        {auth}
      </ul>
    </div>
  );
};

export default NavigationItems;
