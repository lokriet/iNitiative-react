import React from 'react';
import PropTypes from 'prop-types';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import './InlineSelect.module.css';
import GroupedMenu from './GroupedMenu/GroupedMenu';

const InlineSelect = props => {
  const {
    isCreatable,
    isClearable,
    isMulti,
    isGrouped,
    options,
    className,
    ...htmlProps
  } = props;

  const SelectComponent = isCreatable ? CreatableSelect : Select;

  return (
    <SelectComponent
      options={options}
      getOptionLabel={item => item.name}
      getOptionValue={item => item._id}
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
