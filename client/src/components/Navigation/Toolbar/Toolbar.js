import React from 'react';
import NavigationItems from '../NavigationItems/NavigationItems';
import classes from './Toolbar.module.css';

const Toolbar = () => {
  return <header className={classes.Toolbar}>
  <nav className={classes.Navigation}>
    <NavigationItems />
  </nav>
</header>;
};

export default Toolbar;