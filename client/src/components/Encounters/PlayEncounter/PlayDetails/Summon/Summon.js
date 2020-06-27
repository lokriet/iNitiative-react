import React, { useCallback, useState, useEffect } from 'react';
import Popup from 'reactjs-popup';
import Button from '../../../../UI/Form/Button/Button';
import EncounterParticipantSelector from '../../../EncounterParticipantsSelector/EncounterParticipantsSelector';
import classes from './Summon.module.css';
import ItemsRow from '../../../../UI/ItemsRow/ItemsRow';

import { useDispatch, useSelector } from 'react-redux';
import Error from '../../../../UI/Errors/Error/Error';
import ServerError from '../../../../UI/Errors/ServerError/ServerError';
import {
  EditedEncounterAction,
  resetEncounterOperation,
  updateEncounter,
  selectEditedEncounter
} from '../../../store/encounterSlice';

const emptyFunc = () => {};
const Summon = () => {
  const [summonedParticipants, setSummonedParticipants] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [closeFunc, setCloseFunc] = useState({ func: emptyFunc });

  const saveError = useSelector((state) => state.encounter.operationError);
  const saveSuccess = useSelector((state) => state.encounter.operationSuccess);
  const editedEncounter = useSelector(selectEditedEncounter);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetEncounterOperation());
  }, [dispatch]);

  const handleOpen = useCallback(() => {
    dispatch(resetEncounterOperation());
  }, [dispatch]);

  const handleClose = useCallback(() => {
    setSummonedParticipants([]);
    setValidationErrors([]);
    setSubmitAttempted(false);
    dispatch(resetEncounterOperation());
  }, [dispatch]);

  useEffect(() => {
    if (submitAttempted && saveSuccess) {
      handleClose();
      closeFunc.func();
    }
  }, [submitAttempted, saveSuccess, handleClose, closeFunc]);

  const handleSummon = useCallback(
    (close) => {
      setCloseFunc({ func: close });

      let validationErrors = [];

      for (let i = 0; i < summonedParticipants.length; i++) {
        const checkedParticipant = summonedParticipants[i];
        if (checkedParticipant.name.trim() === '') {
          validationErrors.push(`#${i}: participant name should not be empty`);
        } else if (
          summonedParticipants.some((participant) => {
            return (
              participant._tempId !== checkedParticipant._tempId &&
              participant.name.trim() === checkedParticipant.name.trim()
            );
          }) ||
          editedEncounter.participants.some((participant) => {
            return participant.name.trim() === checkedParticipant.name.trim();
          })
        ) {
          validationErrors.push(
            `${checkedParticipant.name}: participant with this name already exists in the encounter`
          );
        }

        if (
          checkedParticipant.rolledInitiative != null &&
          checkedParticipant.rolledInitiative !== ''
        ) {
          let ini = parseFloat(checkedParticipant.rolledInitiative);
          if (ini < 1 || ini > 20) {
            const name =
              checkedParticipant.name != null &&
              checkedParticipant.name.trim() !== ''
                ? checkedParticipant.name
                : `#${i}`;
            validationErrors.push(
              `${name}: rolled initiative should be between 1 and 20`
            );
          }
        }
      }

      setValidationErrors(validationErrors);
      if (validationErrors.length > 0) {
        return;
      }

      setSubmitAttempted(true);
      const participantsToSave = summonedParticipants.map((participant) => {
        let newParticipant = { ...participant };
        delete newParticipant._tempId;
        return newParticipant;
      });

      const updatedEncounter = {
        ...editedEncounter,
        participants: [
          ...editedEncounter.participants,
          ...participantsToSave
        ]
      };

      dispatch(
        updateEncounter(editedEncounter._id, updatedEncounter, {
          editedEncounterAction: EditedEncounterAction.Set
        })
      );
    },
    [summonedParticipants, editedEncounter, dispatch]
  );

  return (
    <Popup
      on="click"
      modal={true}
      closeOnDocumentClick={true}
      closeOnEscape={false}
      trigger={<Button onClick={handleOpen}>Summon!</Button>}
      onClose={handleClose}
      contentStyle={{
        width: 'auto',
        maxWidth: '90%',
        overflow: 'auto'
      }}
    >
      {(close) => (
        <div className={classes.Container}>
          <div className={classes.SummonView}>
            <EncounterParticipantSelector
              participants={summonedParticipants}
              nameCheckParticipants={editedEncounter.participants}
              onParticipantsChanged={(newSummonedParticipants) =>
                setSummonedParticipants(newSummonedParticipants)
              }
            />
          </div>

          <div className={classes.Errors}>
            {validationErrors.map((error, index) => (
              <Error key={index}>{error}</Error>
            ))}
            {saveError ? (
              <div>
                <ServerError serverError={saveError} />
              </div>
            ) : null}
          </div>
          <ItemsRow>
            <Button onClick={() => handleSummon(close)}>Summon!</Button>
            <Button onClick={close}>Close</Button>
          </ItemsRow>
        </div>
      )}
    </Popup>
  );
};

Summon.propTypes = {};

export default Summon;
