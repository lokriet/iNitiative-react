import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import InlineInput from '../../../../../UI/Form/Input/InlineInput/InlineInput';

import classes from './HpCell.module.css';
import ItemsRow from '../../../../../UI/ItemsRow/ItemsRow';
import Button from '../../../../../UI/Form/Button/Button';
import Popup from 'reactjs-popup';
import useDebounce from '../../../../../../hooks/useDebounce';
import { isEmpty } from '../../../../../../util/helper-methods';

const HpCell = ({ participant, onInfoChanged }) => {
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const [hpValues, setHpValues] = useState({
    currentHp: participant.currentHp,
    maxHp: participant.maxHp,
    temporaryHp: participant.temporaryHp || ''
  });
  const handleSetHpValue = useCallback(
    (event, fieldName) => {
      const newValue = event.target.value;
      setHpValues(prevHpValues => ({ ...prevHpValues, [fieldName]: newValue }));
      if (isEmpty(newValue) && isEmpty(participant[fieldName])) {
        return;
      }
      if (newValue < 0) {
        setShowErrorMessage(true);
      } else {
        onInfoChanged({ [fieldName]: newValue });
      }
    },
    [onInfoChanged, participant]
  );

  const [dmgHealHp, setDmgHealHp] = useState('');
  const handleDamageHeal = useCallback(
    isDamage => {
      if (dmgHealHp === '') {
        return;
      }

      let dmgValue = parseInt(dmgHealHp);
      if (dmgValue === 0) {
        return;
      }
      if (dmgValue < 0) {
        setShowErrorMessage(true);
        return;
      }

      let tempValue = hpValues.temporaryHp;
      let currentHpValue = hpValues.currentHp;

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
        currentHpValue = Math.min(participant.maxHp, currentHpValue + dmgValue);
      }

      setHpValues(prevHpValues => ({
        currentHp: currentHpValue,
        temporaryHp: tempValue,
        maxHp: prevHpValues.maxHp
      }));
      onInfoChanged({ currentHp: currentHpValue, temporaryHp: tempValue });

      setDmgHealHp('');
    },
    [
      dmgHealHp,
      onInfoChanged,
      participant.currentHp,
      participant.maxHp,
      participant.temporaryHp
    ]
  );

  const handleCloseErrorPopup = useCallback(() => {
    setHpValues({
      currentHp: participant.currentHp,
      maxHp: participant.maxHp,
      temporaryHp: participant.temporaryHp || ''
    });
    setDmgHealHp('');
    setShowErrorMessage(false);
  }, [participant.currentHp, participant.maxHp, participant.temporaryHp]);

  return (
    <>
      <div>
        <InlineInput
          className={classes.ShortNumberInput}
          type="number"
          name="currentHp"
          value={hpValues.currentHp}
          hidingBorder
          onChange={event => handleSetHpValue(event, 'currentHp')}
        />
        /
        <InlineInput
          className={classes.ShortNumberInput}
          type="number"
          name="maxHp"
          value={hpValues.maxHp}
          hidingBorder
          onChange={event => handleSetHpValue(event, 'maxHp')}
        />
        [
        <InlineInput
          className={classes.ShortNumberInput}
          type="number"
          name="temporaryHp"
          value={hpValues.temporaryHp}
          hidingBorder
          onChange={event => handleSetHpValue(event, 'temporaryHp')}
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

      <Popup
        open={showErrorMessage}
        closeOnDocumentClick
        onClose={handleCloseErrorPopup}
        contentStyle={{ width: 'auto' }}
      >
        {close => (
          <div className={classes.ErrorMessage}>
            <div className={classes.PaddedRow}>
              HP values cannot be negative
            </div>
            <ItemsRow centered>
              <Button onClick={close}>I see!</Button>
            </ItemsRow>
          </div>
        )}
      </Popup>
    </>
  );
};

HpCell.propTypes = {
  participant: PropTypes.object.isRequired
};

export default HpCell;
