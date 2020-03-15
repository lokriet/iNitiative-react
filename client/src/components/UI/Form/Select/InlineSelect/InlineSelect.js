import React from 'react';
import PropTypes from 'prop-types';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import './InlineSelect.module.css';
import GroupedMenu from './GroupedMenu/GroupedMenu';

const InlineSelect = props => {
  const {
    isObjectBased = true,
    isStringBased = false,
    isCreatable,
    isClearable,
    isMulti,
    isGrouped,
    options,
    className,
    ...htmlProps
  } = props;

  const SelectComponent = isCreatable ? CreatableSelect : Select;
  let callbacks = {};
  if (isObjectBased) {
    callbacks = { getOptionLabel: item => item.name, getOptionValue: item => item._id }
  } else if (isStringBased) {
    callbacks = { getOptionLabel: item => item, getOptionValue: item => item };
  }
  return (
    <SelectComponent
      options={options}
      {...callbacks}
      isClearable={isClearable}
      isMulti={isMulti}
      closeMenuOnSelect={!isMulti}
      className={`InlineSelectContainer ${className}`}
      classNamePrefix="InlineSelect"
      components={isGrouped ? { MenuList: GroupedMenu } : {}}
      {...htmlProps}
    />
  );
};

InlineSelect.propTypes = {
  isCreatable: PropTypes.bool,
  isClearable: PropTypes.bool,
  options: PropTypes.array,
  className: PropTypes.string
};

export default InlineSelect;
