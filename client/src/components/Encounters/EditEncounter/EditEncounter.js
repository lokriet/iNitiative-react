import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import * as actions from '../../../store/actions';
import withAuthCheck from '../../../hoc/withAuthCheck';
import { useDispatch, connect } from 'react-redux';
import { Redirect, useHistory, useParams, Prompt } from 'react-router-dom';

import Button from '../../UI/Form/Button/Button';
import ServerError from '../../UI/Errors/ServerError/ServerError';
import ServerValidationError from '../../UI/Errors/ServerValidationError/ServerValidationError';
import ItemsRow from '../../UI/ItemsRow/ItemsRow';
import Spinner from '../../UI/Spinner/Spinner';
import EncounterParticipantsSelector from '../EncounterParticipantsSelector/EncounterParticipantsSelector';
import Error from '../../UI/Errors/Error/Error';

import classes from './EditEncounter.module.css';

const EditEncounter = props => {
  const [encounterName, setEncounterName] = useState('');
  const [addedParticipants, setAddedParticipants] = useState([]);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const { encounterId } = useParams();
  const editMode = !props.isNew;

  useEffect(() => {
    dispatch(actions.resetEncounterOperation());
    dispatch(actions.getParticipantTemplates());

    if (editMode) {
      dispatch(actions.getEncounterById(encounterId));
    }

    return () => {
      if (editMode) {
        dispatch(actions.resetEditedEncounter());
      }
    };
  }, [dispatch, editMode, encounterId]);

  useEffect(() => {
    if (props.editedEncounter) {
      setEncounterName(props.editedEncounter.name);
    }
  }, [props.editedEncounter]);

  const handleParticipantsChanged = useCallback(participants => {
    console.log('changed!');
    setAddedParticipants(participants);
    setHasUnsavedChanges(true);
  }, []);

  const handleSaveEncounter = useCallback(() => {
    let newEncounterName = encounterName.trim();
    setEncounterName(newEncounterName);

    let validationErrors = [];

    if (newEncounterName === '') {
      validationErrors.push('Encounter name should not be empty');
    }
    for (let i = 0; i < addedParticipants.length; i++) {
      const checkedParticipant = addedParticipants[i];
      if (checkedParticipant.name.trim() === '') {
        validationErrors.push(`#${i}: participant name should not be empty`);
      } else if (
        addedParticipants.some(participant => {
          return (
            ((participant._id && participant._id !== checkedParticipant._id) ||
              (participant._tempId &&
                participant._tempId !== checkedParticipant._tempId)) &&
            participant.name.trim() === checkedParticipant.name.trim()
          );
        })
      ) {
        validationErrors.push(`${checkedParticipant.name}: participant with this name already exists in the encounter`);
      }

      if (checkedParticipant.rolledInitiative != null && checkedParticipant.rolledInitiative !== '') {
        let ini = parseFloat(checkedParticipant.rolledInitiative);
        if (ini < 1 || ini > 20) {
          const name = (checkedParticipant.name != null && checkedParticipant.name.trim() !== '') ? checkedParticipant.name : `#${i}`;
          validationErrors.push(`${name}: rolled initiative should be between 1 and 20`);
        }
      }
    }

    setValidationErrors(validationErrors);
    if (validationErrors.length > 0) {
      return;
    }

    setSubmitAttempted(true);
    const participantsToSave = addedParticipants.map(participant => {
      let newParticipant = { ...participant };
      delete newParticipant._tempId;
      return newParticipant;
    });

    if (editMode) {
      dispatch(
        actions.editEncounter(encounterId, {
          _id: encounterId,
          name: encounterName,
          participants: participantsToSave
        })
      );
    } else {
      dispatch(
        actions.editEncounter(null, {
          name: encounterName,
          participants: participantsToSave
        })
      );
    }
  }, [dispatch, encounterName, editMode, encounterId, addedParticipants]);

  let view;
  if (submitAttempted && props.saveSuccess) {
    view = <Redirect to="/encounters" />;
  } else if (editMode && props.fetchingEncounterError) {
    view = <ServerError serverError={props.fetchingEncounterError} />;
  } else if (editMode && !props.editedEncounter) {
    view = <Spinner />;
  } else {
    view = (
      <div className={classes.Container}>
        <Prompt
          when={
            editMode &&
            (hasUnsavedChanges || encounterName !== props.editedEncounter.name)
          }
          message="Confirm leaving the page? All unsaved changes will be lost. "
        />
        <input
          placeholder="Give it a name!"
          className={classes.EncounterName}
          value={encounterName}
          onChange={event => setEncounterName(event.target.value)}
        />
        <ItemsRow>
          <Button type="button" onClick={history.goBack}>
            Cancel
          </Button>
          <Button onClick={handleSaveEncounter}>Save</Button>
        </ItemsRow>

        <div className={classes.Errors}>
          {validationErrors.map((error, index) => (
            <Error key={index}>{error}</Error>
          ))}
          {props.saveError ? (
            <div>
              <ServerValidationError serverError={props.saveError} for="name" />
              <ServerError serverError={props.saveError} />
            </div>
          ) : null}
        </div>

        <div className={classes.ParticipantsSelector}>
          <EncounterParticipantsSelector
            participants={editMode ? props.editedEncounter.participants : []}
            onParticipantsChanged={handleParticipantsChanged}
          />
        </div>
      </div>
    );
  }
  return view;
};

EditEncounter.propTypes = {
  isNew: PropTypes.bool
};

const mapStateToProps = state => {
  return {
    saveError: state.encounter.operationError,
    saveSuccess: state.encounter.operationSuccess,
    editedEncounter: state.encounter.editedEncounter,
    fetchingEncounterError: state.encounter.fetchingError
  };
};

export default connect(mapStateToProps)(withAuthCheck(EditEncounter));
