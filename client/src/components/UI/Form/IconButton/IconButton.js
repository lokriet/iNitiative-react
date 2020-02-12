import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './IconButton.module.css';

const IconButton = props => {
  const { icon, ...htmlProps } = props;

  return (
    <button type="button" className={classes.IconButton} {...htmlProps}>
      <FontAwesomeIcon icon={icon}></FontAwesomeIcon>
    </button>
  );
};

export default IconButton;
