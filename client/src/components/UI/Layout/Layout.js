import React from 'react';
import PropTypes from 'prop-types';

import classes from './Layout.module.css';

const Layout = props => {
  return <main className={classes.Content}>{props.children}</main>;
};

Layout.propTypes = {};

export default Layout;
