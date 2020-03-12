import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { faDiceD6 } from '@fortawesome/free-solid-svg-icons';

import TemplatesPicker from './TemplatesPicker/TemplatesPicker';
import EncounterParticipantRow from './EncounterParticipantRow/EncounterParticipantRow';

import classes from './EncounterParticipantsSelector.module.css';
import IconButton from '../../UI/Form/Button/IconButton/IconButton';
import { generateInitiative } from '../../../util/helper-methods';

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

const EncounterParticipantsSelector = ({
  nameCheckParticipants,
  participants,
  onParticipantsChanged
}) => {
  const [addedParticipants, setAddedParticipants] = useState(
    participants || []
  );

  const handleParticipantUpdate = useCallback(
    (partialUpdate, participant) => {
      setAddedParticipants(previousAddedParticipants => {
        const newParticipants = [...previousAddedParticipants];
        const index = newParticipants.indexOf(participant);
        const newParticipant = {
          ...newParticipants[index],
          ...partialUpdate
        };
        if ("_tempId" in newParticipant && newParticipant.maxHp !== newParticipant.currentHp)  {
          newParticipant.currentHp = newParticipant.maxHp;
        }
        newParticipants[index] = newParticipant;
        onParticipantsChanged(newParticipants);
        console.log('participants updated', newParticipants);
        return newParticipants;
      });
    },
    [onParticipantsChanged]
  );

  const handleParticipantDelete = useCallback(
    index => {
      setAddedParticipants(previousAddedParticipants => {
        const newParticipants = [...previousAddedParticipants];
        newParticipants.splice(index, 1);

        onParticipantsChanged(newParticipants);
        return newParticipants;
      });
    },
    [onParticipantsChanged]
  );

  const handleRollEmptyInitiatives = useCallback(() => {
    setAddedParticipants(previousAddedParticipants => {
      let newParticipants = previousAddedParticipants.map(item => {
        return {
          ...item,
          rolledInitiative: item.rolledInitiative || generateInitiative()
        };
      });

      onParticipantsChanged(newParticipants);
      return newParticipants;
    });
  }, [onParticipantsChanged]);

  const findUnusedName = useCallback(
    name => {
      if (!addedParticipants.some(participant => participant.name === name)  &&
      !(nameCheckParticipants &&
        nameCheckParticipants.some(
          participant => participant.name === name
        ))) {
        return name;
      }
      let i = 2;
      while (true) {
        let newName = `${name} ${i}`;
        if (
          !addedParticipants.some(
            participant => participant.name === newName
          ) &&
          !(nameCheckParticipants &&
            nameCheckParticipants.some(
              participant => participant.name === newName
            ))
        ) {
          return newName;
        }
        i++;
      }
    },
    [addedParticipants, nameCheckParticipants]
  );

  const handleAddParticipant = useCallback(
    participantTemplate => {
      setAddedParticipants(previousAddedParticipants => {
        const name = findUnusedName(participantTemplate.name);
        const newParticipants = previousAddedParticipants.concat(
          convertToEncounterParticipant(participantTemplate, name)
        );

        onParticipantsChanged(newParticipants);
        return newParticipants;
      });
    },
    [findUnusedName, onParticipantsChanged]
  );

  return (
    // <>
    <div className={classes.Container}>
      <div className={classes.TemplatesPicker}>
        <TemplatesPicker onAdd={handleAddParticipant} />
      </div>
      <div className={classes.SelectedTemplatesContainer}>
        <IconButton
          bordered
          icon={faDiceD6}
          onClick={handleRollEmptyInitiatives}
        >
          Roll empty initiatives
        </IconButton>
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
    // </>
  );
};

EncounterParticipantsSelector.propTypes = {
  participants: PropTypes.array,
  nameCheckParticipants: PropTypes.array
};

export default EncounterParticipantsSelector;
