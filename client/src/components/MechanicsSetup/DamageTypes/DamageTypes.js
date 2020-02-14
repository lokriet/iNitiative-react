import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';

import * as actions from '../../../store/actions/index';
import ServerError from '../../UI/Errors/ServerError/ServerError';
import DamageType from './DamageType/DamageType';
import AddDamageType from './AddDamageType/AddDamageType';
import Spinner from '../../UI/Spinner/Spinner';

const DamageTypes = props => {
  const dispatch = useDispatch();
  const allDamageTypes = props.isHomebrew
    ? props.homebrewDamageTypes
    : props.sharedDamageTypes;

  useEffect(() => {
    props.isHomebrew
      ? dispatch(actions.getHomebrewDamageTypes(props.token))
      : dispatch(actions.getSharedDamageTypes());
  }, [dispatch, props.isHomebrew, props.token]);

  const validateName = useCallback(
    (_id, name) => {
      return !allDamageTypes.some(
        item => (_id == null || item._id !== _id) && item.name === name
      );
    },
    [allDamageTypes]
  );

  const handleAddDamageType = useCallback(
    (name, setSubmitted) => {
      dispatch(
        actions.addDamageType(
          { name },
          props.isHomebrew,
          props.token,
          setSubmitted
        )
      );
    },
    [dispatch, props.isHomebrew, props.token]
  );

  const handleUpdateDamageType = useCallback(
    (_id, name, setSubmitted) => {
      dispatch(
        actions.updateDamageType(
          { _id, name },
          props.isHomebrew,
          props.token,
          setSubmitted
        )
      );
    },
    [dispatch, props.isHomebrew, props.token]
  );

  const handleDeleteDamageType = useCallback(
    damageTypeId => {
      dispatch(actions.deleteDamageType(damageTypeId, props.token));
    },
    [dispatch, props.token]
  );

  const handleCancelChangingDamageType = useCallback(
    damageTypeId => {
      dispatch(actions.removeDamageTypeError(damageTypeId));
    },
    [dispatch]
  );

  const fetching = props.isHomebrew ? props.fetchingHomebrew : props.fetchingShared;
  const fetchingError = props.isHomebrew ? props.errorHomebrew : props.errorShared;
  let view;
  if (fetching) {
    view = <Spinner />;
  } else if (fetchingError) {
    view = <ServerError serverError={fetchingError} />;
  } else {
    view = (
      <div>
        <AddDamageType
          onValidateName={validateName}
          onSave={handleAddDamageType}
          onCancel={handleCancelChangingDamageType}
          serverError={props.errors.ADD}
        />

        {allDamageTypes.map(damageType => (
          <DamageType
            key={damageType._id}
            damageType={damageType}
            onSave={handleUpdateDamageType}
            onValidateName={validateName}
            onDelete={handleDeleteDamageType}
            onCancel={handleCancelChangingDamageType}
            serverError={props.errors[damageType._id]}
          />
        ))}
      </div>
    );
  }

  return view;
};

DamageTypes.propTypes = {
  isHomebrew: PropTypes.bool.isRequired
};

const mapStateToProps = state => {
  return {
    homebrewDamageTypes: state.damageType.homebrewDamageTypes,
    sharedDamageTypes: state.damageType.sharedDamageTypes,
    errors: state.damageType.errors,
    errorShared: state.damageType.errorShared,
    errorHomebrew: state.damageType.errorHomebrew,
    fetchingShared: state.damageType.fetchingShared,
    fetchingHomebrew: state.damageType.fetchingHomebrew,
    token: state.auth.token
  };
};

export default connect(mapStateToProps)(DamageTypes);
