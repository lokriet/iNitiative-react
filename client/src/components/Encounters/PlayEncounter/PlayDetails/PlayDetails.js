import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { faPlay, faDiceD6 } from '@fortawesome/free-solid-svg-icons';

import * as actions from '../../../../store/actions';

import Spinner from '../../../UI/Spinner/Spinner';
import ServerError from '../../../UI/Errors/ServerError/ServerError';
import ItemsRow from '../../../UI/ItemsRow/ItemsRow';
import IconButton from '../../../UI/Form/Button/IconButton/IconButton';
import Button from '../../../UI/Form/Button/Button';
import PlayParticipantRow from './PlayParticipantRow/PlayParticipantRow';

import classes from './PlayDetails.module.css';
import useDropdownValues from '../../../../hooks/useDropdownValues';
import { generateInitiative, isEmpty } from '../../../../util/helper-methods';
import { Link } from 'react-router-dom';
import Summon from './Summon/Summon';

const getIni = participant => {
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

const PlayDetails = props => {
  const [showDead, setShowDead] = useState(false);
  const [filteredParticipants, setFilteredParticipants] = useState([]);

  const [damageTypes, combined, features, conditions] = useDropdownValues();

  const dispatch = useDispatch();

  useEffect(() => {
    if (props.editedEncounter) {
      if (!showDead) {
        setFilteredParticipants(
          props.editedEncounter.participants
            .filter(item => item.currentHp > 0)
            .sort(compareParticipants)
        );
      } else {
        setFilteredParticipants(
          props.editedEncounter.participants.sort(compareParticipants)
        );
      }
    }
  }, [props.editedEncounter, showDead]);

  const handleParticipantUpdate = useCallback(
    (partialUpdate, participant) => {
      if (props.editedEncounter) {
        dispatch(
          actions.updateEncounterParticipantDetails(
            props.editedEncounter._id,
            participant._id,
            partialUpdate
          )
        );
      }
    },
    [props.editedEncounter, dispatch]
  );

  const handleValidateName = useCallback(
    (newName, participantId) => {
      if (props.editedEncounter) {
        const result = !props.editedEncounter.participants.some(
          participant =>
            participant._id !== participantId &&
            participant.name === newName.trim()
        );
        console.log('validating name', newName, result);
        return result;
      } else {
        return false;
      }
    },
    [props.editedEncounter]
  );

  const handleRollEmptyInitiatives = useCallback(() => {
    if (props.editedEncounter) {
      props.editedEncounter.participants.forEach(participant => {
        if (isEmpty(participant.rolledInitiative)) {
          dispatch(
            actions.updateEncounterParticipantDetails(
              props.editedEncounter._id,
              participant._id,
              { rolledInitiative: generateInitiative() }
            )
          );
        }
      });
    }
  }, [dispatch, props.editedEncounter]);

  const handleNextMove = useCallback(() => {
    if (props.editedEncounter) {
      let activeParticipantId;
      if (isEmpty(props.editedEncounter.activeParticipantId)) {
        activeParticipantId = filteredParticipants[0]._id;
      } else {
        let currentIndex = filteredParticipants.findIndex(
          item => item._id === props.editedEncounter.activeParticipantId
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

      if (activeParticipantId !== props.editedEncounter.activeParticipantId) {
        dispatch(
          actions.editEncounter(
            props.editedEncounter._id,
            { activeParticipantId: activeParticipantId },
            true
          )
        );
      }
    }
  }, [dispatch, filteredParticipants, props.editedEncounter]);

  let view;
  if (!props.editedEncounter && !props.fetchingEncounterError) {
    view = <Spinner />;
  } else if (props.fetchingEncounterError) {
    view = <ServerError serverError={props.fetchingEncounterError} />;
  } else {
    view = (
      <div className={classes.Container}>
        <div className={classes.EncounterName}>
          {props.editedEncounter.name}
        </div>

        <div className={classes.TableDetailsContainer}>
          <ItemsRow alignCentered className={classes.ButtonsRow}>
            <IconButton icon={faPlay} bordered onClick={handleNextMove}>
              {isEmpty(props.editedEncounter.activeParticipantId)
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
            <Summon />
            <div>
              <input
                type="checkbox"
                name="showDead"
                id="showDead"
                checked={showDead}
                onChange={event => {
                  setShowDead(event.target.checked);
                }}
              />
              <label htmlFor="showDead">Show dead</label>
            </div>
          </ItemsRow>
          {props.editedEncounter.participants.length === 0 ? (
            <div>
              You didn't add any participants to the encounter yet.{' '}
              <Link to={`/encounters/edit/${props.editedEncounter._id}`}>
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
                  <tr><td colSpan={15}><div>Everyone is dead {'><'} </div></td></tr>
                ) : (
                  filteredParticipants.map((participant, index) => (
                    <PlayParticipantRow
                      key={participant._id}
                      participant={participant}
                      isActive={
                        participant._id ===
                        props.editedEncounter.activeParticipantId
                      }
                      dropdownValues={[
                        damageTypes,
                        combined,
                        features,
                        conditions
                      ]}
                      onInfoChanged={partialUpdate =>
                        handleParticipantUpdate(partialUpdate, participant)
                      }
                      isNameValid={newName =>
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

const mapStateToProps = state => {
  return {
    saveError: state.encounter.operationError,
    saveSuccess: state.encounter.operationSuccess,
    editedEncounter: state.encounter.editedEncounter,
    fetchingEncounterError: state.encounter.fetchingError
  };
};

export default connect(mapStateToProps)(PlayDetails);
