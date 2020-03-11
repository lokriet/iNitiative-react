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
            <IconButton icon={faPlay} bordered>
              Next
            </IconButton>
            <IconButton
              icon={faDiceD6}
              bordered
              onClick={handleRollEmptyInitiatives}
            >
              Roll empty initiatives
            </IconButton>
            <Button>Summon!</Button>
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
              {filteredParticipants.map((participant, index) => (
                <PlayParticipantRow
                  key={participant._id}
                  participant={participant}
                  isActive={index === 3}
                  dropdownValues={[damageTypes, combined, features, conditions]}
                  onInfoChanged={partialUpdate =>
                    handleParticipantUpdate(partialUpdate, participant)
                  }
                  isNameValid={newName =>
                    handleValidateName(newName, participant._id)
                  }
                />
              ))}
            </tbody>
          </table>
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
