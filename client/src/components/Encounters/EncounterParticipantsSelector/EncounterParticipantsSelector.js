import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import classes from './EncounterParticipantsSelector.module.css';
import TemplatesPicker from './TemplatesPicker/TemplatesPicker';
import Button from '../../UI/Form/Button/Button';
import { faDiceD6 } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import EncounterParticipantRow from './EncounterParticipantRow/EncounterParticipantRow';

const convertToEncounterParticipant = (participantTemplate, name) => {
  return {
    _tempId: new Date().getTime(),
    name,
    color: null,
    avatarUrl: participantTemplate.avatarUrl,
    type: participantTemplate.type,
    initiativeModifier: participantTemplate.initiativeModifier,
    rolledInitiative: null,
    mapSize: participantTemplate.mapSize,
    currentHp: participantTemplate.maxHp,
    maxHp: participantTemplate.maxHp,
    temporaryHp: null,
    armorClass: participantTemplate.armorClass,
    temporaryArmorClass: null,
    speed: participantTemplate.speed,
    swimSpeed:
      participantTemplate.swimSpeed == null
        ? null
        : participantTemplate.swimSpeed,
    climbSpeed:
      participantTemplate.climbSpeed == null
        ? null
        : participantTemplate.climbSpeed,
    flySpeed:
      participantTemplate.flySpeed == null
        ? null
        : participantTemplate.flySpeed,
    temporarySpeed: null,
    temporarySwimSpeed: null,
    temporaryClimbSpeed: null,
    temporaryFlySpeed: null,
    conditions: [],
    immunities: {
      damageTypes: [...participantTemplate.immunities.damageTypes],
      conditions: [...participantTemplate.immunities.conditions]
    },
    resistances: [...participantTemplate.resistances],
    vulnerabilities: [...participantTemplate.vulnerabilities],
    features: [...participantTemplate.features],
    advantages: null,
    comment: participantTemplate.comment
  };
};

const generageInitiative = () => Math.ceil(Math.random() * 20);

const EncounterParticipantsSelector = ({participants, onParticipantsChanged}) => {
  const [addedParticipants, setAddedParticipants] = useState(
    participants || []
  );

  useEffect(() => {
    onParticipantsChanged(addedParticipants);
  }, [addedParticipants, onParticipantsChanged])

  const handleParticipantUpdate = useCallback((partialUpdate, participant) => {
    setAddedParticipants(previousAddedParticipants => {
      const newParticipants = [...previousAddedParticipants];
      const index = newParticipants.indexOf(participant);
      newParticipants[index] = { ...newParticipants[index], ...partialUpdate };

      return newParticipants;
    });
  }, []);

  const handleParticipantDelete = useCallback(
    (index) => {
      setAddedParticipants(previousAddedParticipants => {
        const newParticipants = [...previousAddedParticipants];
        newParticipants.splice(index, 1);
        return newParticipants;
      });
    },
    [],
  )

  const handleRollEmptyInitiatives = useCallback(() => {
    setAddedParticipants(previousAddedParticipants => {
      let newParticipants = previousAddedParticipants.map(item => {
        return {...item, rolledInitiative: item.rolledInitiative || generageInitiative()}
      });
      return newParticipants;
    });
  }, []);

  const findUnusedName = useCallback(
    name => {
      if (!addedParticipants.some(participant => participant.name === name)) {
        return name;
      }
      let i = 2;
      while (true) {
        let newName = `${name} ${i}`;
        if (
          !addedParticipants.some(participant => participant.name === newName)
        ) {
          return newName;
        }
        i++;
      }
    },
    [addedParticipants]
  );

  const handleAddParticipant = useCallback(
    participantTemplate => {
      setAddedParticipants(previousAddedParticipants => {
        const name = findUnusedName(participantTemplate.name);
        return previousAddedParticipants.concat(
          convertToEncounterParticipant(participantTemplate, name)
        );
      });
    },
    [findUnusedName]
  );

  return (
    <div className={classes.Container}>
      <div className={classes.TemplatesPicker}>
        <TemplatesPicker onAdd={handleAddParticipant} />
      </div>
      <div className={classes.SelectedTemplatesContainer}>
        <Button onClick={handleRollEmptyInitiatives}>
          <FontAwesomeIcon icon={faDiceD6} /> Roll empty initiatives
        </Button>
        <div className={classes.Header}>Added Participants</div>
        {addedParticipants.length === 0 ? (
          <div className={classes.EmptyList}>Start adding</div>
        ) : (
          addedParticipants.map((participant, index) => (
            <EncounterParticipantRow
              participant={participant}
              key={participant._id || participant._tempId}
              onInfoChanged={partialUpdate =>
                handleParticipantUpdate(partialUpdate, participant)
              }
              onDelete={() => handleParticipantDelete(index)}
            />
          ))
        )}
      </div>
    </div>
  );
};

EncounterParticipantsSelector.propTypes = {
  participants: PropTypes.array
};

export default EncounterParticipantsSelector;
