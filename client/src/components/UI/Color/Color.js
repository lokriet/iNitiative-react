import React from 'react';
import PropTypes from 'prop-types';
import classes from './Color.module.css';

const Color = props => {
  return <div style={{backgroundColor: props.color}} className={classes.Color}></div>;
};

Color.propTypes = {
  color: PropTypes.string
};

export default Color;
