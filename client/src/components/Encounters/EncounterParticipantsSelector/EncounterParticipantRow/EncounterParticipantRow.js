import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Popup from 'reactjs-popup';
import Color from '../../../UI/Color/Color';
import ColorPicker from '../../../UI/Color/ColorPicker/ColorPicker';
import InlineInput from '../../../UI/Form/Input/InlineInput/InlineInput';

import classes from './EncounterParticipantRow.module.css';
import ItemsRow from '../../../UI/ItemsRow/ItemsRow';
import useDebounce from '../../../../hooks/useDebounce';
import { faDiceD6, faCog, faTimes } from '@fortawesome/free-solid-svg-icons';
import IconButton from '../../../UI/Form/Button/IconButton/IconButton';

const generageInitiative = () => Math.ceil(Math.random() * 20);

const EncounterParticipantRow = ({ participant, onInfoChanged, onDelete }) => {
  const [name, setName] = useState(participant.name);
  const debouncedName = useDebounce(name, 1000);

  useEffect(() => {
    if (debouncedName !== participant.name) {
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
    onInfoChanged({ rolledInitiative: generageInitiative() });
  }, [onInfoChanged]);

  const handleChangeInitiative = useCallback(event => {
    if (event.target.value !== participant.rolledInitiative) {
      onInfoChanged({ rolledInitiative: event.target.value });
    }
  }, [onInfoChanged, participant.rolledInitiative]);

  return (
    <ItemsRow alignCentered className={classes.Container}>
      <Popup
        on="click"
        trigger={open => (
          <div className={classes.ColorButton}>
            <Color color={participant.color} />
          </div>
        )}
        contentStyle={{ width: 'auto' }}
        closeOnEscape={false}
        closeOnDocumentClick={false}
      >
        {close => (
          <ColorPicker
            selectedColor={participant.color}
            onSelected={newColor => handleColorChange(close, newColor)}
            onCancel={close}
          />
        )}
      </Popup>

      {participant.avatarUrl ? (
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

      <ItemsRow className={classes.ControlButtons}>
        <IconButton icon={faCog} />
        <IconButton icon={faTimes} onClick={onDelete} />
      </ItemsRow>
    </ItemsRow>
  );
};

EncounterParticipantRow.propTypes = {
  participant: PropTypes.object.isRequired,
  onInfoChanged: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default EncounterParticipantRow;
