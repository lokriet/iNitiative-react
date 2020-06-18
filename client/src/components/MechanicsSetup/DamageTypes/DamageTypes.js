import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import ServerError from '../../UI/Errors/ServerError/ServerError';
import DamageType from './DamageType/DamageType';
import AddDamageType from './AddDamageType/AddDamageType';
import Spinner from '../../UI/Spinner/Spinner';
import Popup from 'reactjs-popup';
import ItemsRow from '../../UI/ItemsRow/ItemsRow';
import Button from '../../UI/Form/Button/Button';
import {
  addDamageType,
  updateDamageType,
  deleteDamageType,
  fetchDamageTypes,
  removeDamageTypeError,
  selectors
} from './damageTypeSlice';

const DamageTypes = ({ isHomebrew }) => {
  const [deleting, setDeleting] = useState(false);
  const [deletingDamageType, setDeletingDamageType] = useState(null);

  const dispatch = useDispatch();
  const allDamageTypes = useSelector((state) =>
    isHomebrew
      ? selectors.homebrew.selectAll(state.damageType.homebrew)
      : selectors.shared.selectAll(state.damageType.shared)
  );
  const fetching = useSelector((state) =>
    isHomebrew
      ? state.damageType.homebrew.fetching
      : state.damageType.shared.fetching
  );
  const fetchingError = useSelector((state) =>
    isHomebrew ? state.damageType.homebrew.error : state.damageType.shared.error
  );
  const errors = useSelector((state) =>
    isHomebrew
      ? state.damageType.homebrew.errorsById
      : state.damageType.shared.errorsById
  );

  useEffect(() => {
    dispatch(fetchDamageTypes(isHomebrew));
  }, [dispatch, isHomebrew]);

  const validateName = useCallback(
    (_id, name) => {
      return !allDamageTypes.some(
        (item) => (_id == null || item._id !== _id) && item.name === name
      );
    },
    [allDamageTypes]
  );

  const handleAddDamageType = useCallback(
    (damageType, setSubmitted) => {
      dispatch(addDamageType(damageType, isHomebrew, setSubmitted));
    },
    [dispatch, isHomebrew]
  );

  const handleUpdateDamageType = useCallback(
    (damageType, partialUpdate, setSubmitted) => {
      dispatch(
        updateDamageType(
          { ...damageType, ...partialUpdate },
          isHomebrew,
          setSubmitted
        )
      );
    },
    [dispatch, isHomebrew]
  );

  const handleDeleteDamageTypeClicked = useCallback(
    (damageType) => {
      dispatch(removeDamageTypeError(damageType._id, isHomebrew));
      setDeletingDamageType(damageType);
      setDeleting(true);
    },
    [dispatch, isHomebrew]
  );

  const handleDeleteDamageTypeCancelled = useCallback(() => {
    setDeletingDamageType(null);
    setDeleting(false);
  }, []);

  const handleDeleteDamageTypeConfirmed = useCallback(() => {
    dispatch(deleteDamageType(deletingDamageType._id, isHomebrew));
    setDeletingDamageType(null);
    setDeleting(false);
  }, [dispatch, deletingDamageType, isHomebrew]);

  const handleCancelChangingDamageType = useCallback(
    (damageTypeId) => {
      dispatch(removeDamageTypeError(damageTypeId, isHomebrew));
    },
    [dispatch, isHomebrew]
  );

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
          serverError={errors.ADD}
        />

        {allDamageTypes.map((damageType) => (
          <DamageType
            key={damageType._id}
            damageType={damageType}
            onSave={handleUpdateDamageType}
            onValidateName={validateName}
            onDelete={handleDeleteDamageTypeClicked}
            onCancel={handleCancelChangingDamageType}
            serverError={errors[damageType._id]}
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
              Delete damage type{' '}
              {deletingDamageType ? deletingDamageType.name : ''}?
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

export default DamageTypes;
