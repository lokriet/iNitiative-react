import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import classes from './ArmorClassCell.module.css';
import InlineInput from '../../../../../UI/Form/Input/InlineInput/InlineInput';
import ItemsRow from '../../../../../UI/ItemsRow/ItemsRow';
import Button from '../../../../../UI/Form/Button/Button';
import Popup from 'reactjs-popup';

const ArmorClassCell = ({
  armorClass,
  temporaryArmorClass,
  onInfoChanged
}) => {
  const [temporaryAcInputValue, setTemporaryAcInputValue] = useState(
    temporaryArmorClass
  );

  const handleSetTemopraryAc = useCallback(
    (close) => {
      onInfoChanged({temporaryArmorClass: temporaryAcInputValue});
      close();
    },
    [onInfoChanged, temporaryAcInputValue]
  );

  const handleResetTemporaryAc = useCallback(
    (close) => {
      onInfoChanged({temporaryArmorClass: null});
      setTemporaryAcInputValue('');
      close();
    },
    [onInfoChanged]
  );

  return (
    <Popup
      on="click"
      trigger={open => (
        <div className={classes.PopupTrigger}>
          {temporaryArmorClass === '' ? armorClass : temporaryArmorClass + '*'}
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
              value={temporaryAcInputValue}
              onChange={event => setTemporaryAcInputValue(event.target.value)}
            />
          </div>
          <ItemsRow className={classes.PopupButtons}>
            <Button onClick={() => handleSetTemopraryAc(close)}>Set</Button>
            <Button onClick={() => handleResetTemporaryAc(close)}>Reset</Button>
          </ItemsRow>
        </div>
      )}
    </Popup>
  );
};

ArmorClassCell.propTypes = {
  armorClass: PropTypes.any,
  temporaryArmorClass: PropTypes.any,
  onInfoChanged: PropTypes.func.isRequired
};

export default ArmorClassCell;
