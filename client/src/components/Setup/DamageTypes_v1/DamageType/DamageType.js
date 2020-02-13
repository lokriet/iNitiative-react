import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';

import InlineForm from '../../../UI/InlineForm/InlineForm';
import InlineFormInput from '../../../UI/InlineForm/InlineFormInput/InlineFormInput';
import { connect } from 'react-redux';

const DamageType = ({ allDamageTypes, damageType, onSave, onCancel, onDelete, errors }) => {
  const [otherDamageTypeNames] = useState(
    allDamageTypes
      ? allDamageTypes
          .filter(item => item !== damageType)
          .map(item => item.name)
      : []
  );

  const nameExists = useCallback(
    name => {
      return otherDamageTypeNames.includes(name);
    },
    [otherDamageTypeNames]
  );

  const handleSubmit = useCallback(
    (values, setSubmitting) => {
      console.log(values);
      if (damageType != null) {
        onSave({ ...values, _id: damageType._id }, setSubmitting);
      } else {
        onSave(values, setSubmitting);
      }
    },
    [onSave, damageType]
  );

  const serverError = errors[damageType ? damageType._id : 'ADD'];
  
  return (
    <div>
      <Formik
        initialValues={{
          name: damageType ? damageType.name : ''
        }}
        validationSchema={Yup.object({
          name: Yup.string()
            .required('Required')
            .test(
              'exists',
              'Item with this name already exists',
              value => !nameExists(value)
            )
        })}
        onSubmit={(values, { setSubmitting }) =>
          handleSubmit(values, setSubmitting)
        }
      >
        {formik => (
        <InlineForm isAddNew={damageType == null} onCancelEdit={onCancel}>
          <Field
            name="name"
            type="text"
            placeholder="Name"
            serverError={serverError}
            component={InlineFormInput}
          />
          <button type='button' onClick={onDelete}>X</button>
        </InlineForm>
        )}
      </Formik>
    </div>
  );
};

DamageType.propTypes = {
  allDamageTypes: PropTypes.array,
  damageType: PropTypes.object,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func
};

const mapStateToProps = state => {
  return {
    errors: state.damageType.errors
  };
};

export default connect(mapStateToProps)(DamageType);
