import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSkull, faPlay } from '@fortawesome/free-solid-svg-icons';

import Color from '../../../../UI/Color/Color';
import ItemsRow from '../../../../UI/ItemsRow/ItemsRow';
import InlineInput from '../../../../UI/Form/Input/InlineInput/InlineInput';
import Popup from 'reactjs-popup';

import classes from './PlayParticipantRow.module.css';
import Button from '../../../../UI/Form/Button/Button';
import ListValueCell from './ListValueCell/ListValueCell';
import useDropdownValues from '../../../../../hooks/useDropdownValues';

const PlayParticipantRow = ({ participant, isActive, onInfoChanged }) => {
  const [damageTypes, combined, features, conditions] = useDropdownValues();

  const [currentHp, setCurrentHp] = useState(participant.currentHp);
  const [maxHp, setMaxHp] = useState(participant.maxHp);
  const [temporaryHp, setTemporaryHp] = useState(participant.temporaryHp || '');
  const [dmgHealHp, setDmgHealHp] = useState('');

  const [temporaryArmorClass, setTemporaryArmorClass] = useState(
    participant.temporaryArmorClass || ''
  );
  const temporaryArmorClassRef = React.createRef();

  const [temporarySpeed, setTemporarySpeed] = useState(
    participant.temporarySpeed || ''
  );
  const temporarySpeedRef = React.createRef();

  const [temporarySwimSpeed, setTemporarySwimSpeed] = useState(
    participant.temporarySwimSpeed || ''
  );
  const temporarySwimSpeedRef = React.createRef();

  const [temporaryClimbSpeed, setTemporaryClimbSpeed] = useState(
    participant.temporaryClimbSpeed || ''
  );
  const temporaryClimbSpeedRef = React.createRef();

  const [temporaryFlySpeed, setTemporaryFlySpeed] = useState(
    participant.temporaryFlySpeed || ''
  );
  const temporaryFlySpeedRef = React.createRef();

  const handleDamageHeal = useCallback(
    isDamage => {
      if (dmgHealHp === '') {
        return;
      }

      let dmgValue = parseInt(dmgHealHp);
      if (dmgValue <= 0) {
        return;
      }

      let tempValue = temporaryHp;
      let currentHpValue = currentHp;

      if (isDamage) {
        let remainingDmg = dmgValue;
        if (tempValue !== '' && tempValue > 0) {
          if (dmgValue >= tempValue) {
            remainingDmg -= tempValue;
            tempValue = '';
          } else {
            tempValue -= remainingDmg;
            remainingDmg = 0;
          }
        }
        currentHpValue = Math.max(0, currentHpValue - remainingDmg);
      } else {
        currentHpValue = Math.min(maxHp, currentHpValue + dmgValue);
      }

      setCurrentHp(currentHpValue);
      setTemporaryHp(tempValue);

      setDmgHealHp('');
    },
    [currentHp, maxHp, temporaryHp, dmgHealHp]
  );

  const handleFieldChanged = useCallback(
    (fieldName, fieldValue) => {
      onInfoChanged({ [fieldName]: fieldValue });
    },
    [onInfoChanged]
  );

  return (
    <tr className={classes.ParticipantRow}>
      <td>
        {isActive ? (
          <div className={classes.PaddedRow}>
            <FontAwesomeIcon icon={faPlay} />
          </div>
        ) : null}
        {currentHp > 0 ? null : (
          <div>
            <FontAwesomeIcon icon={faSkull} />
          </div>
        )}
      </td>
      <td className={classes.AvatarCell}>
        {participant.avatarUrl != null && participant.avatarUrl !== '' ? (
          <img
            src={participant.avatarUrl}
            alt={participant.name}
            className={classes.Avatar}
            style={
              participant.color == null || participant.color === ''
                ? {}
                : { borderColor: participant.color }
            }
          />
        ) : participant.color != null && participant.color !== '' ? (
          <Color color={participant.color} />
        ) : null}
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
        <div>
          <InlineInput
            className={classes.ShortNumberInput}
            name="currentHp"
            value={currentHp}
            hidingBorder
            onChange={event => setCurrentHp(event.target.value)}
          />
          /
          <InlineInput
            className={classes.ShortNumberInput}
            name="maxHp"
            value={maxHp}
            hidingBorder
            onChange={event => setMaxHp(event.target.value)}
          />
          [
          <InlineInput
            className={classes.ShortNumberInput}
            name="temporaryHp"
            value={temporaryHp}
            hidingBorder
            onChange={event => setTemporaryHp(event.target.value)}
          />
          ]
        </div>
        <div className={classes.HealDamageControl}>
          <button
            type="button"
            className={classes.HealButton}
            onClick={() => handleDamageHeal(false)}
          >
            Heal
          </button>
          <input
            type="number"
            className={classes.HealInput}
            value={dmgHealHp}
            onChange={event => setDmgHealHp(event.target.value)}
          />
          <button
            type="button"
            className={classes.DamageButton}
            onClick={() => handleDamageHeal(true)}
          >
            Dmg
          </button>
        </div>
      </td>
      <td>
        <Popup
          on="click"
          trigger={open => (
            <div className={classes.PopupTrigger}>
              {temporaryArmorClass === ''
                ? participant.armorClass
                : temporaryArmorClass + '*'}
            </div>
          )}
          contentStyle={{ width: 'auto' }}
        >
          {close => (
            <div>
              <div className={classes.PopupHeader}>Temp value</div>
              <div>
                <InlineInput
                  className={classes.PopupInput}
                  type="number"
                  defaultValue={temporaryArmorClass}
                  ref={temporaryArmorClassRef}
                />
              </div>
              <ItemsRow className={classes.PopupButtons}>
                <Button
                  onClick={() => {
                    setTemporaryArmorClass(
                      temporaryArmorClassRef.current.value
                    );
                    close();
                  }}
                >
                  Set
                </Button>
                <Button
                  onClick={() => {
                    setTemporaryArmorClass('');
                    close();
                  }}
                >
                  Reset
                </Button>
              </ItemsRow>
            </div>
          )}
        </Popup>
      </td>
      <td>
        <Popup
          on="click"
          trigger={open => (
            <div className={classes.PopupTrigger}>
              <div className={classes.PaddedRow}>
                {temporarySpeed === ''
                  ? participant.speed
                  : temporarySpeed + '*'}
              </div>
              {(participant.swimSpeed != null &&
                participant.swimSpeed !== '') ||
              temporarySwimSpeed !== '' ? (
                <div className={classes.PaddedRow}>
                  Swim:{' '}
                  {temporarySwimSpeed === ''
                    ? participant.swimSpeed
                    : temporarySwimSpeed + '*'}
                </div>
              ) : null}
              {(participant.climbSpeed != null &&
                participant.climbSpeed !== '') ||
              temporaryClimbSpeed !== '' ? (
                <div className={classes.PaddedRow}>
                  Climb:{' '}
                  {temporaryClimbSpeed === ''
                    ? participant.climbSpeed
                    : temporaryClimbSpeed + '*'}
                </div>
              ) : null}
              {(participant.flySpeed != null && participant.flySpeed !== '') ||
              temporaryFlySpeed !== '' ? (
                <div className={classes.PaddedRow}>
                  Fly:{' '}
                  {temporaryFlySpeed === ''
                    ? participant.flySpeed
                    : temporaryFlySpeed + '*'}
                </div>
              ) : null}
            </div>
          )}
          contentStyle={{ width: 'auto' }}
        >
          {close => (
            <div>
              <div className={classes.PopupHeader}>Temp values</div>
              <ItemsRow className={classes.PaddedRow} alignCentered>
                <InlineInput
                  className={classes.ShortNumberInput}
                  type="number"
                  defaultValue={temporarySpeed}
                  ref={temporarySpeedRef}
                />
                <Button
                  onClick={() => {
                    setTemporarySpeed(temporarySpeedRef.current.value);
                  }}
                >
                  Set
                </Button>
                <Button
                  onClick={() => {
                    setTemporarySpeed('');
                  }}
                >
                  Reset
                </Button>
              </ItemsRow>
              <ItemsRow className={classes.PaddedRow} alignCentered>
                <label className={classes.SpeedPopupLabel}>Swim</label>
                <InlineInput
                  className={classes.ShortNumberInput}
                  type="number"
                  defaultValue={temporarySwimSpeed}
                  ref={temporarySwimSpeedRef}
                />
                <Button
                  onClick={() => {
                    setTemporarySwimSpeed(temporarySwimSpeedRef.current.value);
                  }}
                >
                  Set
                </Button>
                <Button
                  onClick={() => {
                    setTemporarySwimSpeed('');
                  }}
                >
                  Reset
                </Button>
              </ItemsRow>
              <ItemsRow className={classes.PaddedRow} alignCentered>
                <label className={classes.SpeedPopupLabel}>Climb</label>
                <InlineInput
                  className={classes.ShortNumberInput}
                  type="number"
                  defaultValue={temporaryClimbSpeed}
                  ref={temporaryClimbSpeedRef}
                />
                <Button
                  onClick={() => {
                    setTemporaryClimbSpeed(
                      temporaryClimbSpeedRef.current.value
                    );
                  }}
                >
                  Set
                </Button>
                <Button
                  onClick={() => {
                    setTemporaryClimbSpeed('');
                  }}
                >
                  Reset
                </Button>
              </ItemsRow>
              <ItemsRow className={classes.PaddedRow} alignCentered>
                <label className={classes.SpeedPopupLabel}>Fly</label>
                <InlineInput
                  className={classes.ShortNumberInput}
                  type="number"
                  defaultValue={temporaryFlySpeed}
                  ref={temporaryFlySpeedRef}
                />
                <Button
                  onClick={() => {
                    setTemporaryFlySpeed(temporaryFlySpeedRef.current.value);
                  }}
                >
                  Set
                </Button>
                <Button
                  onClick={() => {
                    setTemporaryFlySpeed('');
                  }}
                >
                  Reset
                </Button>
              </ItemsRow>
              <ItemsRow>
                <Button
                  onClick={() => {
                    setTemporarySpeed(temporarySpeedRef.current.value);
                    setTemporarySwimSpeed(temporarySwimSpeedRef.current.value);
                    setTemporaryClimbSpeed(
                      temporaryClimbSpeedRef.current.value
                    );
                    setTemporaryFlySpeed(temporaryFlySpeedRef.current.value);
                    close();
                  }}
                >
                  Set all
                </Button>
                <Button
                  onClick={() => {
                    setTemporarySpeed('');
                    setTemporarySwimSpeed('');
                    setTemporaryClimbSpeed('');
                    setTemporaryFlySpeed('');
                    close();
                  }}
                >
                  Reset all
                </Button>
                <Button onClick={close}>Close</Button>
              </ItemsRow>
            </div>
          )}
        </Popup>
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
      <td>Advantages</td>
      <td>Comment</td>
      <td>{/* action buttons */}</td>
    </tr>
  );
};

PlayParticipantRow.propTypes = {
  participant: PropTypes.object.isRequired,
  isActive: PropTypes.bool,
  onInfoChanged: PropTypes.func.isRequired
};

export default PlayParticipantRow;
