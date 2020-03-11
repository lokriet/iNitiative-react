import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSkull, faPlay, faCog } from '@fortawesome/free-solid-svg-icons';
import Popup from 'reactjs-popup';

import ListValueCell from './ListValueCell/ListValueCell';
import TextCell from './TextCell/TextCell';
import HpCell from './HpCell/HpCell';
import ArmorClassCell from './ArmorClassCell/ArmorClassCell';
import SpeedCell from './SpeedCell/SpeedCell';
import AvatarCell from './AvatarCell/AvatarCell';

import classes from './PlayParticipantRow.module.css';
import IconButton from '../../../../UI/Form/Button/IconButton/IconButton';
import EditEncounterParticipant from '../../../EditEncounterParticipant/EditEncounterParticipant';
import ItemsRow from '../../../../UI/ItemsRow/ItemsRow';
import Button from '../../../../UI/Form/Button/Button';

const PlayParticipantRow = ({
  dropdownValues,
  participant,
  isActive,
  onInfoChanged,
  isNameValid
}) => {
  const [nameValidationError, setNameValidationError] = useState(false);
  const [damageTypes, combined, features, conditions] = dropdownValues;

  const handleFieldChanged = useCallback(
    (fieldName, fieldValue) => {
      onInfoChanged({ [fieldName]: fieldValue });
    },
    [onInfoChanged]
  );

  const handleSaveParticipantDetails = useCallback(
    (formValues, close) => {
      if (!isNameValid(formValues.name)) {
        setNameValidationError(true);
      } else {
        onInfoChanged(formValues);
        close();
      }
    },
    [isNameValid, onInfoChanged]
  );

  return (
    <tr className={classes.ParticipantRow}>
      <td>
        {isActive ? (
          <div className={classes.PaddedRow}>
            <FontAwesomeIcon icon={faPlay} />
          </div>
        ) : null}
        {participant.currentHp > 0 ? null : (
          <div>
            <FontAwesomeIcon icon={faSkull} />
          </div>
        )}
      </td>
      <td className={classes.AvatarCell}>
        <AvatarCell
          participant={participant}
          onColorChanged={newColor => handleFieldChanged('color', newColor)}
        />
      </td>
      <td>{participant.name}</td>
      <td>
        <Popup
          on="hover"
          arrow={false}
          offsetY={10}
          trigger={open => (
            <div>
              {participant.rolledInitiative == null ||
              participant.rolledInitiative === ''
                ? '???'
                : participant.rolledInitiative + participant.initiativeModifier}
            </div>
          )}
          contentStyle={{ width: 'auto' }}
        >
          <>
            <div className={classes.PaddedRow}>
              rolled:{participant.rolledInitiative}
            </div>
            <div>modifier:{participant.initiativeModifier}</div>
          </>
        </Popup>
      </td>
      <td className={classes.HpCell}>
        <HpCell participant={participant} onInfoChanged={onInfoChanged} />
      </td>
      <td>
        <ArmorClassCell
          armorClass={participant.armorClass}
          temporaryArmorClass={participant.temporaryArmorClass || ''}
          onInfoChanged={onInfoChanged}
        />
      </td>
      <td>
        <SpeedCell participant={participant} onInfoChanged={onInfoChanged} />
      </td>
      <td>
        <ListValueCell
          options={conditions}
          itemsList={participant.conditions}
          onValuesChanged={newValue =>
            handleFieldChanged('conditions', newValue)
          }
        />
      </td>
      <td>
        <ListValueCell
          options={combined}
          isOptionsListGrouped={true}
          isImmunitiesList={true}
          itemsList={participant.immunities}
          onValuesChanged={newValue =>
            handleFieldChanged('immunities', newValue)
          }
        />
      </td>
      <td>
        <ListValueCell
          options={damageTypes}
          itemsList={participant.resistances}
          onValuesChanged={newValue =>
            handleFieldChanged('resistances', newValue)
          }
        />
      </td>
      <td>
        <ListValueCell
          options={damageTypes}
          itemsList={participant.vulnerabilities}
          onValuesChanged={newValue =>
            handleFieldChanged('vulnerabilities', newValue)
          }
        />
      </td>
      <td>
        <ListValueCell
          options={features}
          isOptionsListGrouped={true}
          itemsList={participant.features}
          onValuesChanged={newValue => handleFieldChanged('features', newValue)}
        />
      </td>
      <td className={classes.TextCell}>
        <TextCell
          value={participant.advantages || ''}
          onValueChanged={newValue =>
            handleFieldChanged('advantages', newValue)
          }
        />
      </td>
      <td className={classes.TextCell}>
        <TextCell
          value={participant.comment || ''}
          onValueChanged={newValue => handleFieldChanged('comment', newValue)}
        />
      </td>
      <td>
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
              onSave={formValues =>
                handleSaveParticipantDetails(formValues, close)
              }
              onCancel={close}
            />
          )}
        </Popup>
        <Popup
          open={nameValidationError}
          closeOnDocumentClick
          onClose={() => setNameValidationError(false)}
          contentStyle={{ width: 'auto' }}
        >
          {close => (
            <div className={classes.ErrorMessage}>
              <div className={classes.PaddedRow}>
                Participant with this name already exists in the encounter
              </div>
              <ItemsRow centered>
                <Button onClick={close}>I see!</Button>
              </ItemsRow>
            </div>
          )}
        </Popup>
      </td>
    </tr>
  );
};

PlayParticipantRow.propTypes = {
  participant: PropTypes.object.isRequired,
  isActive: PropTypes.bool,
  onInfoChanged: PropTypes.func.isRequired,
  isNameValid: PropTypes.func.isRequired
};

export default PlayParticipantRow;
