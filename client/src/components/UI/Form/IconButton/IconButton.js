import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './IconButton.module.css';

const IconButton = props => {
  const { icon, ...htmlProps } = props;

  const childrenNo = React.Children.count(props.children);
  const iconClasses = [classes.Icon];
  if (childrenNo > 0) {
    iconClasses.push(classes.PaddedIcon)
  }

  return (
    <button type="button" className={classes.IconButton} {...htmlProps}>
      <FontAwesomeIcon icon={icon} className={iconClasses.join(' ')}></FontAwesomeIcon>
      {props.children}
    </button>
  );
};

export default IconButton;
