import React from 'react';
import PropTypes from 'prop-types';
import { ErrorMessage } from 'formik';
import ServerValidationError from '../../../Errors/ServerValidationError/ServerValidationError';
import InlineSelect from '../InlineSelect/InlineSelect';
import classes from './FormikSelect.module.css';

const FormikSelect = ({
  field, // { name, value, onChange, onBlur }
  form: {setFieldValue},
  ...props
}) => {
  const { serverError, options, isMulti, isGrouped, ...selectProps } = props;

  const onChange = option => {
    let value = option;
    if (value == null) {
      value = isMulti ? [] : '';
    };
    setFieldValue(
      field.name,
      value
    );
  };

  const getValue = () => {
    if (options) {
      if (isGrouped) {
        let value = [];
        options.forEach(group => {
          value = value.concat(
            isMulti
            ? (field.value ? group.options.filter(option => field.value.some(item => item._id === option._id)) : [])
            : group.options.find(option => option._id === field._id)
          );
        });

        const result = isMulti ? value : value.length > 0 ? value[0] : '';
        return result;
      } else {
        return isMulti
          ? (field.value ? options.filter(option => field.value.some(item => item._id === option._id)) : [])
          : options.find(option => option._id === field._id);
      }
    } else {
      return isMulti ? [] : '';
    }
  };

  return (
    <div className={classes.InputContainer}>
      <InlineSelect
        {...selectProps}
        options={options}
        isMulti={isMulti}
        isGrouped={isGrouped}
        name={field.name}
        value={getValue()}
        onChange={onChange}
      />
      <ErrorMessage name={field.name} />
      {serverError ? (
        <ServerValidationError for={field.name} serverError={serverError} />
      ) : null}
    </div>
  );
};

FormikSelect.propTypes = {
  options: PropTypes.any,
  isMulti: PropTypes.bool,
  isGrouped: PropTypes.bool,
  className: PropTypes.string
};

export default FormikSelect;
