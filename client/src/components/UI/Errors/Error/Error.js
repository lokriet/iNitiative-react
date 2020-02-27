import React from 'react';
import classes from './Error.module.css';

const Error = props => {
  const {className, ...otherProps} = props;
  const classList = [classes.Error];
  if (className) {
    classList.push(className);
  }
  return (
    <div className={classList.join(' ')} {...otherProps}>
      {props.children}
    </div>
  );
};

export default Error;
