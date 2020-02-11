import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';

import InlineForm from '../../../UI/InlineForm/InlineForm';
import Input from '../../../UI/Form/Input/Input';
import InlineFormInput from '../../../UI/InlineForm/InlineFormInput/InlineFormInput';

const DamageType = ({
  allDamageTypes,
  damageType,
  onSave
}) => {
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

  const submitHandler = useCallback(
    (values, setSubmitting) => {
      console.log(values);
      if (damageType != null) {
        onSave({...values, _id: damageType._id}, setSubmitting)
      } else {
        onSave(values, setSubmitting);
      }
    },
    [onSave, damageType],
  );

  return (
    <div>
      <Formik
        initialValues={{
          name: damageType ? damageType.name : '',
          description: damageType ? damageType.description : ''
        }}
        validationSchema={Yup.object({
          name: Yup.string().required('Required').test(
            'exists',
            'Item with this name already exists',
            value => !nameExists(value)
          )
        })}
        onSubmit={(values, {setSubmitting}) => submitHandler(values, setSubmitting)}
      >
        {formik => (
        <InlineForm isAddNew={damageType == null}>
          <Field
            name="name"
            type="text"
            placeholder="Name"
            component={InlineFormInput}
          />
          <Field
            name="description"
            type="textarea"
            placeholder="Name"
            component={InlineFormInput}
          />
        </InlineForm>
        )}
      </Formik>
    </div>
  );
};

DamageType.propTypes = {
  allDamageTypes: PropTypes.array,
  damageType: PropTypes.object,
  onSave: PropTypes.func
};

export default DamageType;
