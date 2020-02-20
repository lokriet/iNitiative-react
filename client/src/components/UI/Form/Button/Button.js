import React from 'react';
import classes from './Button.module.css';

const Button = props => {
  const { className, ...htmlProps } = props;

  return (
    <button className={`${classes.Button} ${className}`} {...htmlProps}>
      {props.children}
    </button>
  );
};

export default Button;
