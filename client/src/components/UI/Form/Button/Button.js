import React from 'react';
import classes from './Button.module.css';

const Button = React.forwardRef((props, ref) => {
  const { className, ...htmlProps } = props;

  return (
    <button className={`${classes.Button} ${className}`} {...htmlProps} ref={ref}>
      {props.children}
    </button>
  );
});

export default Button;
