import React from 'react';
import PropTypes from 'prop-types';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select/src/Select';
import classes from './InlineSelect.module.css';

const InlineSelect = props => {
  const {isCreatable, isClearable, options, className, ...htmlProps } = props;

  const SelectComponent = isCreatable ? CreatableSelect : Select;

  return (
    <SelectComponent
      options={options}
      isClearable={isClearable}
      className={`${classes.InlineSelectContainer} ${className}`}
      classNamePrefix="InlineSelect"
      {...htmlProps}
    />
  );
};

InlineSelect.propTypes = {};

export default InlineSelect;
