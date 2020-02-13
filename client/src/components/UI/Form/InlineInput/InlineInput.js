import React from 'react';
import PropTypes from 'prop-types';
import classes from './InlineInput.module.css';
import TextareaAutosize from 'react-textarea-autosize';

const InlineInput = React.forwardRef((props, ref) => {
  const { inputType, className, ...htmlProps } = props;

  let element;
  switch (inputType) {
    case 'textarea':
      element = (
        <TextareaAutosize
          minRows={1}
          maxRows={12}
          className={`${classes.InlineInput} ${className}`}
          {...htmlProps}
          inputRef={ref || (() => {})}
        />
      );
      break;
    default:
      element = (
        <input className={`${classes.InlineInput} ${className}`} {...htmlProps} ref={ref} />
      );
  }

  return element;
});

InlineInput.propTypes = {
  inputType: PropTypes.string
};

export default InlineInput;
