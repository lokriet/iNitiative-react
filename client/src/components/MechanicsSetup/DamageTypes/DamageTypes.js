import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';

import * as actions from '../../../store/actions/index';
import ServerError from '../../UI/Errors/ServerError/ServerError';
import DamageType from './DamageType/DamageType';
import AddDamageType from './AddDamageType/AddDamageType';
import Spinner from '../../UI/Spinner/Spinner';
import Popup from 'reactjs-popup';
import ItemsRow from '../../UI/ItemsRow/ItemsRow';
import Button from '../../UI/Form/Button/Button';

const DamageTypes = props => {
  const [deleting, setDeleting] = useState(false);
  const [deletingDamageType, setDeletingDamageType] = useState(null);

  const dispatch = useDispatch();
  const allDamageTypes = props.isHomebrew
    ? props.homebrewDamageTypes
    : props.sharedDamageTypes;

  useEffect(() => {
    props.isHomebrew
      ? dispatch(actions.getHomebrewDamageTypes())
      : dispatch(actions.getSharedDamageTypes());
  }, [dispatch, props.isHomebrew]);

  const validateName = useCallback(
    (_id, name) => {
      return !allDamageTypes.some(
        item => (_id == null || item._id !== _id) && item.name === name
      );
    },
    [allDamageTypes]
  );

  const handleAddDamageType = useCallback(
    (damageType, setSubmitted) => {
      dispatch(actions.addDamageType(damageType, props.isHomebrew, setSubmitted));
    },
    [dispatch, props.isHomebrew]
  );

  const handleUpdateDamageType = useCallback(
    (damageType, partialUpdate, setSubmitted) => {
      dispatch(
        actions.updateDamageType({ ...damageType, ...partialUpdate }, props.isHomebrew, setSubmitted)
      );
    },
    [dispatch, props.isHomebrew]
  );

  const handleDeleteDamageTypeClicked = useCallback(
    damageType => {
      dispatch(actions.removeDamageTypeError(damageType._id));
      setDeletingDamageType(damageType);
      setDeleting(true);
    },
    [dispatch]
  );

  const handleDeleteDamageTypeCancelled = useCallback(() => {
    setDeletingDamageType(null);
    setDeleting(false);
  }, []);

  const handleDeleteDamageTypeConfirmed = useCallback(() => {
    dispatch(actions.deleteDamageType(deletingDamageType._id));
    setDeletingDamageType(null);
    setDeleting(false);
  }, [dispatch, deletingDamageType]);

  const handleCancelChangingDamageType = useCallback(
    damageTypeId => {
      dispatch(actions.removeDamageTypeError(damageTypeId));
    },
    [dispatch]
  );

  const fetching = props.isHomebrew
    ? props.fetchingHomebrew
    : props.fetchingShared;
  const fetchingError = props.isHomebrew
    ? props.errorHomebrew
    : props.errorShared;
  let view;
  if (fetching) {
    view = <Spinner />;
  } else if (fetchingError) {
    view = <ServerError serverError={fetchingError} />;
  } else {
    view = (
      <>
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
            onDelete={handleDeleteDamageTypeClicked}
            onCancel={handleCancelChangingDamageType}
            serverError={props.errors[damageType._id]}
          />
        ))}

        <Popup
          open={deleting}
          modal
          closeOnDocumentClick={false}
          closeOnEscape={false}
          contentStyle={{ width: 'auto' }}
        >
          <div>
            <div>
              Delete damage type {deletingDamageType ? deletingDamageType.name : ''}
              ?
            </div>
            <br />
            <ItemsRow centered>
              <Button onClick={handleDeleteDamageTypeConfirmed}>Yes</Button>
              <Button onClick={handleDeleteDamageTypeCancelled}>No</Button>
            </ItemsRow>
          </div>
        </Popup>
      </>
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
    fetchingHomebrew: state.damageType.fetchingHomebrew
  };
};

export default connect(mapStateToProps)(DamageTypes);
