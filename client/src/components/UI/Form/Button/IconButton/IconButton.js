import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './IconButton.module.css';

const IconButton = React.forwardRef((props, ref) => {
  const { icon, ...htmlProps } = props;

  const childrenNo = React.Children.count(props.children);
  const iconClasses = [classes.Icon];
  if (childrenNo > 0) {
    iconClasses.push(classes.PaddedIcon)
  }

  return (
    <button ref={ref} type="button" className={classes.IconButton} {...htmlProps}>
      <FontAwesomeIcon icon={icon} className={iconClasses.join(' ')}></FontAwesomeIcon>
      {props.children}
    </button>
  );
});

export default IconButton;
