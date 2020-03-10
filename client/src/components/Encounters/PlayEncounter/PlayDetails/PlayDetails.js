import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import * as actions from '../../../../store/actions';
import withAuthCheck from '../../../../hoc/withAuthCheck';
import { useDispatch, connect } from 'react-redux';
import { Redirect, useHistory, useParams, Prompt } from 'react-router-dom';

import Spinner from '../../../UI/Spinner/Spinner';
import ServerError from '../../../UI/Errors/ServerError/ServerError';

import classes from './PlayDetails.module.css';
import ItemsRow from '../../../UI/ItemsRow/ItemsRow';
import IconButton from '../../../UI/Form/Button/IconButton/IconButton';
import { faPlay, faDiceD6 } from '@fortawesome/free-solid-svg-icons';
import Button from '../../../UI/Form/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PlayParticipantRow from './PlayParticipantRow/PlayParticipantRow';
import useDropdownValues from '../../../../hooks/useDropdownValues';

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

  // TODO: change to a database update
  const [playParticipants, setPlayParticipants] = useState([]);
  useEffect(() => {
    if (props.editedEncounter) {
      setPlayParticipants(props.editedEncounter.participants);
    }
  }, [props.editedEncounter]);
  // End of TODO

  useEffect(() => {
    if (props.editedEncounter) {
      if (showDead) {
        setFilteredParticipants(
          props.editedEncounter.participants
            .filter(item => item.currentHp > 0)
            .sort(compareParticipants)
        );
      }
      setFilteredParticipants(
        props.editedEncounter.participants.sort(compareParticipants)
      );
    }
  }, [props.editedEncounter, showDead]);

  const handleParticipantUpdate = useCallback(
    (partialUpdate, participant) => {
      setPlayParticipants(previousAddedParticipants => {
        const newParticipants = [...previousAddedParticipants];
        const index = newParticipants.indexOf(participant);
        if (index >= 0) {
          newParticipants[index] = {
            ...newParticipants[index],
            ...partialUpdate
          };
        }

        // onParticipantsChanged(newParticipants);
        console.log('participants updated', newParticipants);
        return newParticipants;
      });
    },
    []
  );

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

        <div>
          <ItemsRow alignCentered className={classes.ButtonsRow}>
            <IconButton icon={faPlay} bordered>
              Next
            </IconButton>
            <IconButton icon={faDiceD6} bordered>
              Roll empty initiatives
            </IconButton>
            <Button>Summon!</Button>
            <div>
              <input
                type="checkbox"
                name="showDead"
                id="showDead"
                value={showDead}
                onChange={event => setShowDead(event.target.value)}
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
                  onInfoChanged={(partialUpdate) => handleParticipantUpdate(partialUpdate, participant)}
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
