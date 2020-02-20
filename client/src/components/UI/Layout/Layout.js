import React from 'react';

import Toolbar from '../../Navigation/Toolbar/Toolbar';

import classes from './Layout.module.css';

const Layout = props => {
  return (
    <div className={classes.Page}>
      <header className={classes.Header}>
        <Toolbar />
      </header>
      <main className={classes.Content}>{props.children}</main>
    </div>
  );
};

export default Layout;
