import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';

import * as actions from '../../../store/actions/index';
import DamageType from './DamageType/DamageType';

const DamageTypes = props => {
  const dispatch = useDispatch();
  const allDamageTypes = props.isHomebrew
    ? props.homebrewDamageTypes
    : props.sharedDamageTypes;

  useEffect(() => {
    dispatch(actions.getSharedDamageTypes());
  }, [dispatch]);

  const validateName = useCallback(
    (_id, name) => {
      return !allDamageTypes.some(
        item => (_id == null || item._id !== _id) && item.name === name
      );
    },
    [allDamageTypes]
  );

  const handleUpdateDamageType = useCallback(
    (_id, name, setSubmitting) => {
      dispatch(
        actions.updateDamageType(
          { _id, name },
          props.isHomebrew,
          props.token,
          setSubmitting
        )
      );
    },
    [dispatch, props.isHomebrew, props.token]
  );

  return (
    <div>
      {allDamageTypes.map(damageType => (
        <DamageType
          key={damageType._id}
          damageType={damageType}
          onSave={handleUpdateDamageType}
          onValidateName={validateName}
          serverError={props.errors[damageType._id]}
        />
      ))}
    </div>
  );
};

DamageTypes.propTypes = {
  isHomebrew: PropTypes.bool.isRequired
};

const mapStateToProps = state => {
  return {
    homebrewDamageTypes: state.damageType.homebrewDamageTypes,
    sharedDamageTypes: state.damageType.sharedDamageTypes,
    errors: state.damageType.errors,
    token: state.auth.token
  };
};

export default connect(mapStateToProps)(DamageTypes);
