import React from 'react';
import PropTypes from 'prop-types';
import { ErrorMessage } from 'formik';
import ServerValidationError from '../../../Errors/ServerValidationError/ServerValidationError';
import InlineSelect from '../InlineSelect/InlineSelect';

const FormikSelect = ({
  field, // { name, value, onChange, onBlur }
  form: {setFieldValue},
  ...props
}) => {
  const { serverError, options, ...selectProps } = props;

  const onChange = selectedOptions => {
    const damageTypes = [];
    const conditions = [];
    if (selectedOptions) {
      selectedOptions.forEach(selectedOption => {
        if (options[0].options.some(option => option._id === selectedOption._id)) {
          damageTypes.push(selectedOption);
        } else {
          conditions.push(selectedOption);
        }
      });
    }
    
    setFieldValue(
      field.name,
      {
        damageTypes,
        conditions
      }
    );
  };

  const getValue = () => {
    if (options) {
        let value = [];
        const fieldValueCombined = field.value ? [...field.value.damageTypes, ...field.value.conditions] : null;

        options.forEach(group => {
          value = value.concat(
            fieldValueCombined ? group.options.filter(option => fieldValueCombined.some(item => item._id === option._id)) : []
          );
        });

        const result = value;
        return result;
    } else {
      return [];
    }
  };

  return (
    <div>
      <InlineSelect
        {...selectProps}
        options={options}
        isMulti={true}
        isGrouped={true}
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
  className: PropTypes.string
};

export default FormikSelect;
