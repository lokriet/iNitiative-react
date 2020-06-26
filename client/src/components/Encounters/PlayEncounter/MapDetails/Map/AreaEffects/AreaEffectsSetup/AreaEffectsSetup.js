import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import EditAreaEffectForm from './EditAreaEffectForm/EditAreaEffectForm';
import { useSelector } from 'react-redux';
import { isEmpty } from '../../../../../../../util/helper-methods';
import Color from '../../../../../../UI/Color/Color';
import classes from './AreaEffectsSetup.module.css';
import AddButton from '../../../../../../UI/Form/Button/AddButton/AddButton';
import ItemsRow from '../../../../../../UI/ItemsRow/ItemsRow';
import IconButton from '../../../../../../UI/Form/Button/IconButton/IconButton';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Popup from 'reactjs-popup';
import Button from '../../../../../../UI/Form/Button/Button';
import { selectEditedEncounter } from '../../../../../encounterSlice';

const AreaEffectsSetup = ({
  editedAreaEffect,
  onAreaEffectChanged,
  onAreaEffectSaved,
  onAreaEffectDeleted
}) => {
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  const editedEncounter = useSelector(selectEditedEncounter);

  const handleAreaEffectChanged = useCallback(
    partialUpdate => {
      const updatedAreaEffect = { ...editedAreaEffect, ...partialUpdate };
      onAreaEffectChanged(updatedAreaEffect);
    },
    [editedAreaEffect, onAreaEffectChanged]
  );

  const handleListItemSelected = useCallback(
    areaEffect => {
      onAreaEffectChanged(areaEffect);
      setShowForm(true);
    },
    [onAreaEffectChanged]
  );

  const handleAddButtonClicked = useCallback(() => {
    if (!showForm || (editedAreaEffect && editedAreaEffect._id != null)) {
      onAreaEffectChanged(null);
      setShowForm(true);
    }
  }, [onAreaEffectChanged, editedAreaEffect, showForm]);

  const handleCancelEdit = useCallback(() => {
    onAreaEffectChanged(null);
    setShowForm(false);
  }, [onAreaEffectChanged]);

  const handleSave = useCallback(() => {
    onAreaEffectSaved();
    setShowForm(false);
  }, [onAreaEffectSaved]);

  const handleDeleteConfirmed = useCallback(() => {
    if (
      editedAreaEffect &&
      editedAreaEffect._id &&
      editedAreaEffect._id.toString() === idToDelete.toString()
    ) {
      onAreaEffectChanged(null);
      setShowForm(false);
    }

    onAreaEffectDeleted(idToDelete);
    setIdToDelete(null);
    setShowDeleteConfirmation(false);
  }, [onAreaEffectDeleted, onAreaEffectChanged, editedAreaEffect, idToDelete]);

  const handleDeleteButtonClicked = useCallback(areaEffectId => {
    setIdToDelete(areaEffectId);
    setShowDeleteConfirmation(true);
  }, []);

  const handleDeleteCancelled = useCallback(() => {
    setIdToDelete(null);
    setShowDeleteConfirmation(false);
  }, []);

  return (
    <div className={classes.Container}>
      <div className={classes.AreaEffectList}>
        <AddButton
          className={classes.AddButton}
          onClick={handleAddButtonClicked}
        />

        {editedEncounter.map.areaEffects.map(areaEffect => (
          <ItemsRow
            key={areaEffect._id || areaEffect._tempId}
            alignCentered
            className={`${classes.AreaEffectItem} ${
              editedAreaEffect &&
              editedAreaEffect._id &&
              areaEffect._id.toString() === editedAreaEffect._id.toString()
                ? classes.Selected
                : ''
            }`}
          >
            <ItemsRow
              alignCentered
              onClick={() => handleListItemSelected(areaEffect)}
            >
              <Color
                color={areaEffect.color}
                className={classes.AreaEffectItemColor}
              />
              <div className={classes.AreaEffectItemName}>
                {isEmpty(areaEffect.name) ? '<noname>' : areaEffect.name}
              </div>
            </ItemsRow>
            <IconButton
              icon={faTimes}
              onClick={() => handleDeleteButtonClicked(areaEffect._id)}
            />
          </ItemsRow>
        ))}
      </div>
      {showForm ? (
        <div className={classes.EditForm}>
          <EditAreaEffectForm
            onAdd={onAreaEffectChanged}
            onEdit={handleAreaEffectChanged}
            onCancel={handleCancelEdit}
            onSave={handleSave}
            areaEffect={editedAreaEffect}
          />
        </div>
      ) : null}

      <Popup
        modal
        open={showDeleteConfirmation}
        closeOnDocumentClick={false}
        closeOnEscape={false}
        contentStyle={{ width: 'auto' }}
      >
        <div>
          <div>Delete area effect?</div>
          <br />
          <ItemsRow>
            <Button onClick={handleDeleteConfirmed}>Yes</Button>
            <Button onClick={handleDeleteCancelled}>No</Button>
          </ItemsRow>
        </div>
      </Popup>
    </div>
  );
};

AreaEffectsSetup.propTypes = {
  editedAreaEffect: PropTypes.object,
  onAreaEffectChanged: PropTypes.func.isRequired,
  onAreaEffectSaved: PropTypes.func.isRequired,
  onAreaEffectDeleted: PropTypes.func.isRequired
};

export default AreaEffectsSetup;
