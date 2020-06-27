import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  faPlay,
  faDiceD6,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import {
  EditedEncounterAction,
  updateEncounterParticipant,
  updateEncounter,
  selectEditedEncounter
} from '../../store/encounterSlice';

import Spinner from '../../../UI/Spinner/Spinner';
import ServerError from '../../../UI/Errors/ServerError/ServerError';
import ItemsRow from '../../../UI/ItemsRow/ItemsRow';
import IconButton from '../../../UI/Form/Button/IconButton/IconButton';
import PlayParticipantRow from './PlayParticipantRow/PlayParticipantRow';

import classes from './PlayDetails.module.css';
import useDropdownValues from '../../../../hooks/useDropdownValues';
import { generateInitiative, isEmpty } from '../../../../util/helper-methods';
import { Link } from 'react-router-dom';
import Summon from './Summon/Summon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../../UI/Form/Button/Button';
import Popup from 'reactjs-popup';

const getIni = (participant) => {
  const rolledInitiative =
    participant.rolledInitiative == null || participant.rolledInitiative === ''
      ? 0
      : parseInt(participant.rolledInitiative);
  const modifier = parseInt(participant.initiativeModifier);
  return rolledInitiative + modifier;
};

const compareParticipants = (a, b) => {
  let result = getIni(b) - getIni(a);
  if (result !== 0) {
    return result;
  } else {
    return a.name.localeCompare(b.name);
  }
};

const PlayDetails = () => {
  const [showDead, setShowDead] = useState(false);
  const [filteredParticipants, setFilteredParticipants] = useState([]);

  const [damageTypes, combined, features, conditions] = useDropdownValues();

  const saveError = useSelector((state) => state.encounter.operationError);
  const editedEncounter = useSelector(selectEditedEncounter);
  const fetchingEncounterError = useSelector(
    (state) => state.encounter.fetchingError
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (editedEncounter) {
      if (!showDead) {
        setFilteredParticipants(
          editedEncounter.participants
            .filter((item) => item.currentHp > 0)
            .sort(compareParticipants)
        );
      } else {
        setFilteredParticipants(
          [...editedEncounter.participants].sort(compareParticipants)
        );
      }
    }
  }, [editedEncounter, showDead]);

  const handleParticipantUpdate = useCallback(
    (partialUpdate, participant) => {
      if (editedEncounter) {
        dispatch(
          updateEncounterParticipant(
            editedEncounter._id,
            participant._id,
            partialUpdate
          )
        );
      }
    },
    [editedEncounter, dispatch]
  );

  const handleValidateName = useCallback(
    (newName, participantId) => {
      if (editedEncounter) {
        const result = !editedEncounter.participants.some(
          (participant) =>
            participant._id !== participantId &&
            participant.name === newName.trim()
        );
        return result;
      } else {
        return false;
      }
    },
    [editedEncounter]
  );

  const handleRollEmptyInitiatives = useCallback(() => {
    if (editedEncounter) {
      editedEncounter.participants.forEach((participant) => {
        if (isEmpty(participant.rolledInitiative)) {
          dispatch(
            updateEncounterParticipant(
              editedEncounter._id,
              participant._id,
              { rolledInitiative: generateInitiative() }
            )
          );
        }
      });
    }
  }, [dispatch, editedEncounter]);

  const handleNextMove = useCallback(() => {
    if (editedEncounter) {
      let activeParticipantId;
      if (isEmpty(editedEncounter.activeParticipantId)) {
        activeParticipantId = filteredParticipants[0]._id;
      } else {
        let currentIndex = filteredParticipants.findIndex(
          (item) => item._id === editedEncounter.activeParticipantId
        );
        let attemptsNo = 0;
        currentIndex = (currentIndex + 1) % filteredParticipants.length;
        while (
          filteredParticipants[currentIndex].currentHp <= 0 &&
          attemptsNo < filteredParticipants.length - 1
        ) {
          currentIndex = (currentIndex + 1) % filteredParticipants.length;
          attemptsNo++;
        }
        activeParticipantId = filteredParticipants[currentIndex]._id;
      }

      if (activeParticipantId !== editedEncounter.activeParticipantId) {
        dispatch(
          updateEncounter(
            editedEncounter._id,
            { activeParticipantId: activeParticipantId },
            {
              editedEncounterAction: EditedEncounterAction.Update,
              applyChangesOnError: true,
              overwriteError: false
            }
          )
        );
      }
    }
  }, [dispatch, filteredParticipants, editedEncounter]);

  const handleAttemptErrorFix = useCallback(() => {
    dispatch(
      updateEncounter(
        editedEncounter._id,
        {
          ...editedEncounter
        },
        { editedEncounterAction: EditedEncounterAction.Set }
      )
    );
  }, [dispatch, editedEncounter]);

  let view;
  if (!editedEncounter && !fetchingEncounterError) {
    view = <Spinner />;
  } else if (fetchingEncounterError) {
    view = <ServerError serverError={fetchingEncounterError} />;
  } else {
    view = (
      <div className={classes.Container}>
        <div className={classes.EncounterName}>
          {editedEncounter.name}
        </div>
        <div className={classes.TableDetailsContainer}>
          {saveError ? (
            <div className={classes.SavingError}>
              <div className={classes.SavingErrorText}>
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className={classes.SavingErrorIcon}
                />
                {` An error occured while saving changes to database. 

Check your Internet connection and try 'attempt fix' button below. If the problem persists contact our hardworking developers.

Please note, you can continue working, but if you reload the page before the problem is fixed, all unsaved changes will be lost.`}
              </div>
              <br />
              <div>
                <Button onClick={handleAttemptErrorFix}>Attempt fix</Button>
              </div>
            </div>
          ) : null}
          <ItemsRow alignCentered className={classes.ButtonsRow}>
            <IconButton icon={faPlay} bordered onClick={handleNextMove}>
              {isEmpty(editedEncounter.activeParticipantId)
                ? 'First move'
                : 'Next move'}
            </IconButton>
            <IconButton
              icon={faDiceD6}
              bordered
              onClick={handleRollEmptyInitiatives}
            >
              Roll empty initiatives
            </IconButton>
            {saveError ? (
              <Popup on="hover" trigger={<Button disabled>Summon</Button>}>
                <div>Summon functionality is unavailable in error state</div>
              </Popup>
            ) : (
              <Summon />
            )}
            <div>
              <input
                type="checkbox"
                name="showDead"
                id="showDead"
                checked={showDead}
                onChange={(event) => {
                  setShowDead(event.target.checked);
                }}
              />
              <label htmlFor="showDead">Show dead</label>
            </div>
          </ItemsRow>
          {editedEncounter.participants.length === 0 ? (
            <div>
              You didn't add any participants to the encounter yet.{' '}
              <Link to={`/encounters/edit/${editedEncounter._id}`}>
                Go add some!
              </Link>
            </div>
          ) : (
            <table className={classes.PlayTable}>
              <thead>
                <tr className={classes.TableHeader}>
                  <th>{/* indicators */}</th>
                  <th>{/* avatar */}</th>
                  <th>Name</th>
                  <th>Ini</th>
                  <th>HP</th>
                  <th>AC</th>
                  <th>Spd</th>
                  <th>Conditions</th>
                  <th>Immune</th>
                  <th>Resist</th>
                  <th>Vulnerable</th>
                  <th>Features</th>
                  <th>Advantages</th>
                  <th>Comment</th>
                  <th>{/* action buttons */}</th>
                </tr>
              </thead>
              <tbody>
                {filteredParticipants.length === 0 ? (
                  <tr>
                    <td colSpan={15}>
                      <div>Everyone is dead {'><'} </div>
                    </td>
                  </tr>
                ) : (
                  filteredParticipants.map((participant, index) => (
                    <PlayParticipantRow
                      key={participant._id}
                      participant={participant}
                      isActive={
                        participant._id ===
                        editedEncounter.activeParticipantId
                      }
                      dropdownValues={[
                        damageTypes,
                        combined,
                        features,
                        conditions
                      ]}
                      onInfoChanged={(partialUpdate) =>
                        handleParticipantUpdate(partialUpdate, participant)
                      }
                      isNameValid={(newName) =>
                        handleValidateName(newName, participant._id)
                      }
                    />
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  return view;
};

PlayDetails.propTypes = {};

export default PlayDetails;
