import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import InlineInput from '../../../../../UI/Form/Input/InlineInput/InlineInput';
import useDebounce from '../../../../../../hooks/useDebounce';
import classes from './TextCell.module.css';

const TextCell = ({ value, onValueChanged }) => {
  const [currentText, setCurrentText] = useState(value);
  const debouncedName = useDebounce(currentText, 10000);

  useEffect(() => {
    if (debouncedName !== value) {
      onValueChanged(debouncedName);
    }
  }, [debouncedName, value, onValueChanged]);

  const handleSaveTextValue = useCallback(() => {
    if (currentText !== (value || '')) {
      onValueChanged(currentText);
    }
  }, [onValueChanged, currentText, value]);

  return (
    <InlineInput
      inputType="textarea"
      hidingBorder
      className={classes.Textarea}
      value={currentText}
      onChange={event => setCurrentText(event.target.value)}
      onBlur={handleSaveTextValue}
    />
  );
};

TextCell.propTypes = {
  value: PropTypes.string,
  onValueChanged: PropTypes.func.isRequired
};

export default TextCell;
