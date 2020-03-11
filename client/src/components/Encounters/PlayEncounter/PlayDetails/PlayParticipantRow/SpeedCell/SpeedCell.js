import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import classes from './SpeedCell.module.css';
import Popup from 'reactjs-popup';
import ItemsRow from '../../../../../UI/ItemsRow/ItemsRow';
import InlineInput from '../../../../../UI/Form/Input/InlineInput/InlineInput';
import Button from '../../../../../UI/Form/Button/Button';
import IconButton from '../../../../../UI/Form/Button/IconButton/IconButton';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { isEmpty } from '../../../../../../util/helper-methods';

const SpeedCell = ({ participant, onInfoChanged }) => {
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const [temporarySpeedInputValue, setTemporarySpeedInputValue] = useState(
    participant.temporarySpeed || ''
  );

  const [
    temporarySwimSpeedInputValue,
    setTemporarySwimSpeedInputValue
  ] = useState(participant.temporarySwimSpeed || '');

  const [
    temporaryClimbSpeedInputValue,
    setTemporaryClimbSpeedInputValue
  ] = useState(participant.temporaryClimbSpeed || '');

  const [
    temporaryFlySpeedInputValue,
    setTemporaryFlySpeedInputValue
  ] = useState(participant.temporaryFlySpeed || '');

  const handleSetAll = useCallback(
    close => {
      let partialUpdate = {};
      if (temporarySpeedInputValue !== (participant.temporarySpeed || '')) {
        partialUpdate.temporarySpeed = temporarySpeedInputValue;
      }
      if (
        temporarySwimSpeedInputValue !== (participant.temporarySwimSpeed || '')
      ) {
        partialUpdate.temporarySwimSpeed = temporarySwimSpeedInputValue;
      }
      if (
        temporaryClimbSpeedInputValue !==
        (participant.temporaryClimbSpeed || '')
      ) {
        partialUpdate.temporaryClimbSpeed = temporaryClimbSpeedInputValue;
      }
      if (
        temporaryFlySpeedInputValue !== (participant.temporaryFlySpeed || '')
      ) {
        partialUpdate.temporaryFlySpeed = temporaryFlySpeedInputValue;
      }
      onInfoChanged(partialUpdate);
      close();
    },
    [
      onInfoChanged,
      temporarySpeedInputValue,
      temporarySwimSpeedInputValue,
      temporaryClimbSpeedInputValue,
      temporaryFlySpeedInputValue,
      participant.temporarySpeed,
      participant.temporarySwimSpeed,
      participant.temporaryClimbSpeed,
      participant.temporaryFlySpeed
    ]
  );

  const handleResetAll = useCallback(
    close => {
      setTemporarySpeedInputValue('');
      setTemporarySwimSpeedInputValue('');
      setTemporaryClimbSpeedInputValue('');
      setTemporaryFlySpeedInputValue('');

      let partialUpdate = {};
      if (!isEmpty(participant.temporarySpeed)) {
        partialUpdate.temporarySpeed = null;
      }
      if (!isEmpty(participant.temporarySwimSpeed)) {
        partialUpdate.temporarySwimSpeed = null;
      }
      if (!isEmpty(participant.temporaryClimbSpeed)) {
        partialUpdate.temporaryClimbSpeed = null;
      }
      if (!isEmpty(participant.temporaryFlySpeed)) {
        partialUpdate.temporaryFlySpeed = null;
      }
      onInfoChanged(partialUpdate);
      close();
    },
    [
      onInfoChanged,
      participant.temporarySpeed,
      participant.temporarySwimSpeed,
      participant.temporaryClimbSpeed,
      participant.temporaryFlySpeed
    ]
  );

  const handleSetTemporarySpeed = useCallback(() => {
    if (temporarySpeedInputValue >= 0) {
      onInfoChanged({ temporarySpeed: temporarySpeedInputValue });
    } else {
      setShowErrorMessage(true);
    }
  }, [temporarySpeedInputValue, onInfoChanged]);

  const handleSetTemporarySwimSpeed = useCallback(() => {
    if (temporarySwimSpeedInputValue >= 0) {
      onInfoChanged({ temporarySwimSpeed: temporarySwimSpeedInputValue });
    } else {
      setShowErrorMessage(true);
    }
  }, [temporarySwimSpeedInputValue, onInfoChanged]);

  const handleSetTemporaryClimbSpeed = useCallback(() => {
    if (temporaryClimbSpeedInputValue >= 0) {
      onInfoChanged({ temporaryClimbSpeed: temporaryClimbSpeedInputValue });
    } else {
      setShowErrorMessage(true);
    }
  }, [temporaryClimbSpeedInputValue, onInfoChanged]);

  const handleSetTemporaryFlySpeed = useCallback(() => {
    if (temporaryFlySpeedInputValue >= 0) {
      onInfoChanged({ temporaryFlySpeed: temporaryFlySpeedInputValue });
    } else {
      setShowErrorMessage(true);
    }
  }, [temporaryFlySpeedInputValue, onInfoChanged]);

  return (
    <Popup
      on="click"
      trigger={open => (
        <div className={classes.PopupTrigger}>
          <div className={classes.PaddedRow}>
            {isEmpty(participant.temporarySpeed)
              ? participant.speed
              : participant.temporarySpeed + '*'}
          </div>
          {!isEmpty(participant.swimSpeed) ||
          !isEmpty(participant.temporarySwimSpeed) ? (
            <div className={classes.PaddedRow}>
              Swim:{' '}
              {isEmpty(participant.temporarySwimSpeed)
                ? participant.swimSpeed
                : participant.temporarySwimSpeed + '*'}
            </div>
          ) : null}
          {!isEmpty(participant.climbSpeed) ||
          !isEmpty(participant.temporaryClimbSpeed) ? (
            <div className={classes.PaddedRow}>
              Climb:{' '}
              {isEmpty(participant.temporaryClimbSpeed)
                ? participant.climbSpeed
                : participant.temporaryClimbSpeed + '*'}
            </div>
          ) : null}
          {!isEmpty(participant.flySpeed) ||
          !isEmpty(participant.temporaryFlySpeed) ? (
            <div className={classes.PaddedRow}>
              Fly:{' '}
              {isEmpty(participant.temporaryFlySpeed)
                ? participant.flySpeed
                : participant.temporaryFlySpeed + '*'}
            </div>
          ) : null}
        </div>
      )}
      contentStyle={{ width: 'auto' }}
    >
      {close => (
        <>
          <div className={classes.Popup}>
            <div className={classes.PopupHeader}>Temp values</div>
            <ItemsRow className={classes.PaddedRow} alignCentered>
              <InlineInput
                className={classes.ShortNumberInput}
                type="number"
                value={temporarySpeedInputValue}
                onChange={event =>
                  setTemporarySpeedInputValue(event.target.value)
                }
              />
              <Button onClick={handleSetTemporarySpeed}>Set</Button>
              <Button
                onClick={() => {
                  setTemporarySpeedInputValue('');
                  onInfoChanged({ temporarySpeed: null });
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
                value={temporarySwimSpeedInputValue}
                onChange={event =>
                  setTemporarySwimSpeedInputValue(event.target.value)
                }
              />
              <Button onClick={handleSetTemporarySwimSpeed}>Set</Button>
              <Button
                onClick={() => {
                  setTemporarySwimSpeedInputValue('');
                  onInfoChanged({ temporarySwimSpeed: null });
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
                value={temporaryClimbSpeedInputValue}
                onChange={event =>
                  setTemporaryClimbSpeedInputValue(event.target.value)
                }
              />
              <Button onClick={handleSetTemporaryClimbSpeed}>Set</Button>
              <Button
                onClick={() => {
                  setTemporaryClimbSpeedInputValue('');
                  onInfoChanged({ temporaryClimbSpeed: null });
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
                value={temporaryFlySpeedInputValue}
                onChange={event =>
                  setTemporaryFlySpeedInputValue(event.target.value)
                }
              />
              <Button onClick={handleSetTemporaryFlySpeed}>Set</Button>
              <Button
                onClick={() => {
                  setTemporaryFlySpeedInputValue('');
                  onInfoChanged({ temporaryFlySpeed: null });
                }}
              >
                Reset
              </Button>
            </ItemsRow>
            <ItemsRow>
              <Button
                onClick={() => {
                  handleSetAll(close);
                }}
              >
                Set all
              </Button>
              <Button
                onClick={() => {
                  handleResetAll(close);
                }}
              >
                Reset all
              </Button>
              {/* <Button onClick={close}>Close</Button> */}
            </ItemsRow>

            <IconButton
              icon={faTimes}
              onClick={close}
              className={classes.CloseIconButton}
            />
          </div>

          <Popup
            open={showErrorMessage}
            closeOnDocumentClick
            onClose={() => setShowErrorMessage(false)}
            contentStyle={{ width: 'auto' }}
          >
            {close => (
              <div className={classes.ErrorMessage}>
                <div className={classes.PaddedRow}>
                  Speed values can't be negative
                </div>
                <ItemsRow centered>
                  <Button onClick={close}>I see!</Button>
                </ItemsRow>
              </div>
            )}
          </Popup>
        </>
      )}
    </Popup>
  );
};

SpeedCell.propTypes = {
  participant: PropTypes.object.isRequired,
  onInfoChanged: PropTypes.func.isRequired
};

export default SpeedCell;
