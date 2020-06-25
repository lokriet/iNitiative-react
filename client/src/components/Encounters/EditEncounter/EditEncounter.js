import React, { useEffect, useRef, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Prompt, useParams, useHistory } from 'react-router-dom';

import Button from '../../UI/Form/Button/Button';
import ServerError from '../../UI/Errors/ServerError/ServerError';
import ServerValidationError from '../../UI/Errors/ServerValidationError/ServerValidationError';
import ItemsRow from '../../UI/ItemsRow/ItemsRow';
import Spinner from '../../UI/Spinner/Spinner';
import EncounterParticipantsSelector from '../EncounterParticipantsSelector/EncounterParticipantsSelector';
import Error from '../../UI/Errors/Error/Error';

import classes from './EditEncounter.module.css';
import { isEmpty } from '../../../util/helper-methods';
import withAuthCheck from '../../../hoc/withAuthCheck';
import { cleanUpAvatarUrls } from '../../../store/common/commonSlice';

import {
  resetEncounterOperation,
  fetchEditedEncounter,
  resetEditedEncounter,
  updateEncounter,
  addEncounter,
  selectEditedEncounter
} from '../encounterSlice';

const EditEncounter = ({ isNew }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { encounterId } = useParams();

  const [avatarUrlsToCheck, setAvatarUrlsToCheck] = useState(new Set());
  const avatarUrlsToCheckRef = useRef(avatarUrlsToCheck);
  avatarUrlsToCheckRef.current = avatarUrlsToCheck;

  const [encounterName, setEncounterName] = useState('');
  const [addedParticipants, setAddedParticipants] = useState([]);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const saveError = useSelector((state) => state.encounter.operationError);
  const saveSuccess = useSelector((state) => state.encounter.operationSuccess);
  const editedEncounter = useSelector(selectEditedEncounter);
  const fetchingEncounterError = useSelector(
    (state) => state.encounter.fetchingError
  );

  useEffect(() => {
    dispatch(resetEncounterOperation());
    if (!isNew) {
      dispatch(fetchEditedEncounter(encounterId));
    }
    return () => {
      if (!isNew) {
        dispatch(resetEditedEncounter());
      }
      dispatch(cleanUpAvatarUrls(avatarUrlsToCheckRef.current));
    };
  }, [dispatch, isNew, encounterId]);

  useEffect(() => {
    if (editedEncounter && !initialized) {
      const newSet = new Set(avatarUrlsToCheckRef.current);
      editedEncounter.participants.forEach((item) => {
        if (!isEmpty(item.avatarUrl)) {
          newSet.add(item.avatarUrl);
        }
      });

      setEncounterName(editedEncounter.name);
      setAddedParticipants(editedEncounter.participants);
      setAvatarUrlsToCheck(newSet);
      setInitialized(true);
    }
  }, [initialized, editedEncounter]);

  const handleParticipantsChanged = (participants) => {
    const newSet = new Set(avatarUrlsToCheck);
    participants.forEach((item) => {
      if (!isEmpty(item.avatarUrl)) {
        newSet.add(item.avatarUrl);
      }
    });
    setAvatarUrlsToCheck(avatarUrlsToCheck);
    setAddedParticipants(participants);
    setHasUnsavedChanges(true);
  };

  const handleNameChanged = (event) => {
    setEncounterName(event.target.value);
  };

  const handleSaveEncounter = () => {
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
        addedParticipants.some((participant) => {
          return (
            ((participant._id && participant._id !== checkedParticipant._id) ||
              (participant._tempId &&
                participant._tempId !== checkedParticipant._tempId)) &&
            participant.name.trim() === checkedParticipant.name.trim()
          );
        })
      ) {
        validationErrors.push(
          `${checkedParticipant.name}: participant with this name already exists in the encounter`
        );
      }

      if (
        checkedParticipant.rolledInitiative != null &&
        checkedParticipant.rolledInitiative !== ''
      ) {
        let ini = parseFloat(checkedParticipant.rolledInitiative);
        if (ini < 1 || ini > 20) {
          const name =
            checkedParticipant.name != null &&
            checkedParticipant.name.trim() !== ''
              ? checkedParticipant.name
              : `#${i}`;
          validationErrors.push(
            `${name}: rolled initiative should be between 1 and 20`
          );
        }
      }
    }

    setValidationErrors(validationErrors);
    if (validationErrors.length > 0) {
      return;
    }

    setSubmitAttempted(true);
    const participantsToSave = addedParticipants.map((participant) => {
      let newParticipant = { ...participant };
      delete newParticipant._tempId;
      return newParticipant;
    });

    if (!isNew) {
      dispatch(
        updateEncounter(encounterId, {
          _id: encounterId,
          name: encounterName,
          participants: participantsToSave
        })
      );
    } else {
      dispatch(
        addEncounter({
          name: encounterName,
          participants: participantsToSave
        })
      );
    }
  };

  let view;
  if (submitAttempted && saveSuccess) {
    view = <Redirect to="/encounters" />;
  } else if (!isNew && fetchingEncounterError) {
    view = <ServerError serverError={fetchingEncounterError} />;
  } else if (!isNew && !editedEncounter) {
    view = <Spinner />;
  } else {
    view = (
      <div className={classes.Container}>
        <Prompt
          when={
            !isNew &&
            (hasUnsavedChanges || encounterName !== editedEncounter.name)
          }
          message="Confirm leaving the page? All unsaved changes will be lost. "
        />
        <input
          placeholder="Give it a name!"
          className={classes.EncounterName}
          value={encounterName}
          onChange={handleNameChanged}
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
          {saveError ? (
            <div>
              <ServerValidationError serverError={saveError} for="name" />
              <ServerError serverError={saveError} />
            </div>
          ) : null}
        </div>

        <div className={classes.ParticipantsSelector}>
          <EncounterParticipantsSelector
            participants={!isNew ? editedEncounter.participants : []}
            onParticipantsChanged={handleParticipantsChanged}
          />
        </div>
      </div>
    );
  }

  return view;
};

export default withAuthCheck(EditEncounter);
