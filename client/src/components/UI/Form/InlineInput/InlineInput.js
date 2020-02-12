import React from 'react';
import PropTypes from 'prop-types';
import classes from './InlineInput.module.css';

const InlineInput = React.forwardRef((props, ref) => {
  const { inputType, ...htmlProps } = props;

  let element;
  switch (inputType) {
    default:
      element = <input className={classes.InlineInput} {...htmlProps} ref={ref} />;
  }

  return element;
});

InlineInput.propTypes = {
  inputType: PropTypes.string
};

export default InlineInput;
