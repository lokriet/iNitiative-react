import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Popup from 'reactjs-popup';
import Color from '../../../UI/Color/Color';
import ColorPicker from '../../../UI/Color/ColorPicker/ColorPicker';
import InlineInput from '../../../UI/Form/Input/InlineInput/InlineInput';

import classes from './EncounterParticipantRow.module.css';
import ItemsRow from '../../../UI/ItemsRow/ItemsRow';
import useDebounce from '../../../../hooks/useDebounce';
import {
  faDiceD6,
  faCog,
  faTimes,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import IconButton from '../../../UI/Form/Button/IconButton/IconButton';
import ParticipantDetailsPopup from './ParticipantDetailsPopup/ParticipantDetailsPopup';
import EditEncounterParticipant from '../../EditEncounterParticipant/EditEncounterParticipant';
import Error from '../../../UI/Errors/Error/Error';
import { generateInitiative } from '../../../../util/helper-methods';

const EncounterParticipantRow = ({ participant, onInfoChanged, onDelete }) => {
  const [name, setName] = useState(participant.name);
  const debouncedName = useDebounce(name, 1000);
  const [iniError, setIniError] = useState(false);

  useEffect(() => {
    if (debouncedName !== participant.name) {
      console.log('changing info on debounced name change');
      onInfoChanged({ name: debouncedName });
    }
  }, [debouncedName, onInfoChanged, participant.name]);

  const handleColorChange = useCallback(
    (close, newColor) => {
      onInfoChanged({ color: newColor });
      close();
    },
    [onInfoChanged]
  );

  const handleRollInitiative = useCallback(() => {
    setIniError(false);
    onInfoChanged({ rolledInitiative: generateInitiative() });
  }, [onInfoChanged]);

  const handleChangeInitiative = useCallback(
    event => {
      let newValue = event.target.value;
      if (newValue != null &&  newValue !== '') {
        newValue = parseFloat(newValue);
      };
      if (newValue !== participant.rolledInitiative) {
        if (newValue != null &&  newValue !== '' && (newValue < 1 || newValue > 20)) {
          setIniError(true);
        } else {
          setIniError(false);
        }
        onInfoChanged({ rolledInitiative: newValue });
      }
    },
    [onInfoChanged, participant.rolledInitiative]
  );

  const handleChangeDetails = useCallback(
    (formValues, close) => {
      setName(formValues.name);
      onInfoChanged(formValues);
      close();
    },
    [onInfoChanged],
  )

  return (
    <div className={classes.Container}>
      <ItemsRow alignCentered>
        <Popup
          on="click"
          trigger={open => (
            <div className={classes.ColorButton}>
              <Color color={participant.color} />
            </div>
          )}
          offsetY={10}
          contentStyle={{ width: 'auto' }}
        >
          {close => (
            <ColorPicker
              selectedColor={participant.color}
              onSelected={newColor => handleColorChange(close, newColor)}
              onCancel={close}
            />
          )}
        </Popup>

        {participant.avatarUrl != null && participant.avatarUrl !== '' ? (
          <div className={classes.AvatarContainer}>
            <img
              className={classes.Avatar}
              src={participant.avatarUrl}
              alt={participant.name}
            />
          </div>
        ) : null}

        <InlineInput
          hidingBorder
          className={classes.NameInput}
          value={name}
          onChange={event => setName(event.target.value)}
        />

        <div>
          {parseFloat(participant.initiativeModifier) +
            (parseFloat(participant.rolledInitiative) || 0)}
        </div>
        <div className={classes.InitiativeSum}>
          (
          <InlineInput
            hidingBorder
            className={classes.InitiativeInput}
            type="number"
            value={participant.rolledInitiative || ''}
            min={1}
            max={20}
            onChange={handleChangeInitiative}
          />{' '}
          <IconButton
            icon={faDiceD6}
            onClick={handleRollInitiative}
            className={classes.RollButton}
          />{' '}
          +&nbsp;&nbsp;
          {participant.initiativeModifier})
        </div>

        <ItemsRow className={classes.ControlButtons} alignCentered>
          <Popup
            on="hover"
            position="bottom right"
            offsetX={60}
            arrow={false}
            trigger={open => <IconButton icon={faInfoCircle} className={classes.InfoButton} />}
            contentStyle={{ width: 'auto' }}
          >
            <ParticipantDetailsPopup participant={participant} />
          </Popup>
          <Popup
            on="click"
            modal
            trigger={open => <IconButton icon={faCog} />}
            contentStyle={{ width: 'auto' }}
            closeOnEscape={false}
            closeOnDocumentClick={false}
          >
            {close => (
              <EditEncounterParticipant
                participant={participant}
                onSave={formValues => handleChangeDetails(formValues, close)}
                onCancel={close}
              />
            )}
          </Popup>

          <IconButton icon={faTimes} onClick={onDelete} />
        </ItemsRow>
      </ItemsRow>
      {iniError ? <Error>Initiative should be between 1 and 20</Error> : null}
    </div>
  );
};

EncounterParticipantRow.propTypes = {
  participant: PropTypes.object.isRequired,
  onInfoChanged: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default EncounterParticipantRow;
