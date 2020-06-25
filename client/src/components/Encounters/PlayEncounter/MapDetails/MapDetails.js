import React, { useCallback } from 'react';

import ItemsRow from '../../../UI/ItemsRow/ItemsRow';
import Button from '../../../UI/Form/Button/Button';
import LoadMap from './LoadMap/LoadMap';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../../UI/Spinner/Spinner';
import ServerError from '../../../UI/Errors/ServerError/ServerError';
import Popup from 'reactjs-popup';
import { EditedEncounterAction, updateEncounter, selectEditedEncounter } from '../../encounterSlice';
import { isEmpty } from '../../../../util/helper-methods';
import Map from './Map/Map';
import classes from './MapDetails.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { sum } from './Map/AreaEffects/aoe-utils';
import { firebaseDeleteImage } from '../../../Firebase/firebaseMiddleware';

const MapDetails = () => {
  const saveError = useSelector(state => state.encounter.operationError);
  const editedEncounter = useSelector(selectEditedEncounter);
  const fetchingEncounterError = useSelector(state => state.encounter.fetchingError);

  const dispatch = useDispatch();

  const handleDeleteMap = useCallback(
    close => {
      if (editedEncounter) {
        if (editedEncounter.map) {
          dispatch(firebaseDeleteImage(editedEncounter.map.mapUrl));
          dispatch(
            updateEncounter(
              editedEncounter._id,
              { map: null },
              {
                editedEncounterAction: EditedEncounterAction.Update,
                applyChangesOnError: true,
                overwriteError: false
              }
            )
          );
        }
      }
      close();
    },
    [editedEncounter, dispatch]
  );

  const handleNewMapUploaded = useCallback(
    mapInfo => {
      if (editedEncounter) {
        if (editedEncounter.map) {
          dispatch(firebaseDeleteImage(editedEncounter.map.mapUrl));
        }
      }

      dispatch(
        updateEncounter(
          editedEncounter._id,
          {
            map: {
              ...mapInfo,
              gridColor: '#aaaaaa',
              showGrid:
                !isEmpty(mapInfo.gridWidth) && !isEmpty(mapInfo.gridHeight),
              showInfo: true,
              showDead: false,
              snapToGrid:
                !isEmpty(mapInfo.gridWidth) && !isEmpty(mapInfo.gridHeight),

              participantCoordinates: [],
              areaEffects: []
            }
          },
          {
            editedEncounterAction: EditedEncounterAction.Update,
            applyChangesOnError: true,
            overwriteError: false
          }
        )
      );
    },
    [dispatch, editedEncounter]
  );

  const handleAddParticipantOnMap = useCallback(
    newMapParticipant => {
      dispatch(
        updateEncounter(
          editedEncounter._id,
          {
            map: {
              ...editedEncounter.map,
              participantCoordinates: editedEncounter.map.participantCoordinates.concat(
                newMapParticipant
              )
            }
          },
          {
            editedEncounterAction: EditedEncounterAction.Update,
            applyChangesOnError: true,
            overwriteError: false
          }
        )
      );
    },
    [dispatch, editedEncounter]
  );

  const handleMapParticipantChanged = useCallback(
    editedMapParticipant => {
      const initialMapParticipant = editedEncounter.map.participantCoordinates.find(
        item =>
          item.participantId.toString() ===
          editedMapParticipant.participantId.toString()
      );

      let newAreaEffects = editedEncounter.map.areaEffects;
      if (
        editedMapParticipant.mapX !== initialMapParticipant.mapX ||
        editedMapParticipant.mapY !== initialMapParticipant.mapY
      ) {
        const moveVector = {
          x: editedMapParticipant.mapX - initialMapParticipant.mapX,
          y: editedMapParticipant.mapY - initialMapParticipant.mapY
        };

        newAreaEffects = editedEncounter.map.areaEffects.map(
          areaEffect => {
            if (
              areaEffect.followingParticipantId &&
              areaEffect.followingParticipantId.toString() ===
                editedMapParticipant.participantId.toString()
            ) {
              return {
                ...areaEffect,
                position: sum(areaEffect.position, moveVector)
              };
            } else {
              return areaEffect;
            }
          }
        );
      }

      dispatch(
       updateEncounter(
          editedEncounter._id,
          {
            map: {
              ...editedEncounter.map,
              participantCoordinates: editedEncounter.map.participantCoordinates.map(
                participantCoordinate =>
                  participantCoordinate.participantId.toString() ===
                  editedMapParticipant.participantId.toString()
                    ? editedMapParticipant
                    : participantCoordinate
              ),
              areaEffects: newAreaEffects
            }
          },
          {
            editedEncounterAction: EditedEncounterAction.Update,
            applyChangesOnError: true,
            overwriteError: false
          }
        )
      );
    },
    [dispatch, editedEncounter]
  );

  const handleMapParticipantDeleted = useCallback(
    participantId => {
      const newAreaEffects = editedEncounter.map.areaEffects.filter(
        areaEffect =>
          !areaEffect.followingParticipantId ||
          areaEffect.followingParticipantId.toString() !==
            participantId.toString()
      );

      dispatch(
        updateEncounter(
          editedEncounter._id,
          {
            map: {
              ...editedEncounter.map,
              participantCoordinates: editedEncounter.map.participantCoordinates.filter(
                participantCoordinate =>
                  participantCoordinate.participantId.toString() !==
                  participantId.toString()
              ),
              areaEffects: newAreaEffects
            }
          },
          {
            editedEncounterAction: EditedEncounterAction.Update,
            applyChangesOnError: true,
            overwriteError: false
          }
        )
      );
    },
    [dispatch, editedEncounter]
  );

  const handleMapDetailsChanged = useCallback(
    mapDetails => {
      dispatch(
        updateEncounter(
          editedEncounter._id,
          {
            map: {
              ...editedEncounter.map,
              ...mapDetails
            }
          },
          {
            editedEncounterAction: EditedEncounterAction.Update,
            applyChangesOnError: true,
            overwriteError: false
          }
        )
      );
    },
    [dispatch, editedEncounter]
  );

  const handleAreaEffectAdded = useCallback(
    areaEffect => {
      dispatch(
        updateEncounter(
          editedEncounter._id,
          {
            map: {
              ...editedEncounter.map,
              areaEffects: [
                ...editedEncounter.map.areaEffects,
                areaEffect
              ]
            }
          },
          {
            editedEncounterAction: EditedEncounterAction.Set,
            applyChangesOnError: false,
            overwriteError: true
          }
        )
      );
    },
    [dispatch, editedEncounter]
  );

  const handleAreaEffectChanged = useCallback(
    areaEffect => {
      dispatch(
        updateEncounter(
          editedEncounter._id,
          {
            map: {
              ...editedEncounter.map,
              areaEffects: editedEncounter.map.areaEffects.map(item =>
                item._id.toString() === areaEffect._id.toString()
                  ? areaEffect
                  : item
              )
            }
          },
          {
            editedEncounterAction: EditedEncounterAction.Update,
            applyChangesOnError: true,
            overwriteError: false
          }
        )
      );
    },
    [dispatch, editedEncounter]
  );

  const handleAreaEffectDeleted = useCallback(
    areaEffectId => {
      dispatch(
        updateEncounter(
          editedEncounter._id,
          {
            map: {
              ...editedEncounter.map,
              areaEffects: editedEncounter.map.areaEffects.filter(
                item => item._id.toString() !== areaEffectId.toString()
              )
            }
          },
          {
            editedEncounterAction: EditedEncounterAction.Update,
            applyChangesOnError: true,
            overwriteError: false
          }
        )
      );
    },
    [dispatch, editedEncounter]
  );

  const handleAttemptErrorFix = useCallback(() => {
    dispatch(
      updateEncounter(
        editedEncounter._id,
        {
          ...editedEncounter
        },
        { editedEncounterAction: EditedEncounterAction.Set }
      )
    );
  }, [dispatch, editedEncounter]);

  let view;
  if (!editedEncounter && !fetchingEncounterError) {
    view = <Spinner />;
  } else if (fetchingEncounterError) {
    view = <ServerError serverError={fetchingEncounterError} />;
  } else {
    view = (
      <div className={classes.Container}>
        {saveError ? (
          <div className={classes.SavingError}>
            <div className={classes.SavingErrorText}>
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                className={classes.SavingErrorIcon}
              />
              {` An error occured while saving changes to database. 

Check your Internet connection and try 'attempt fix' button below. If the problem persists contact our hardworking developers.

Please note, you can continue working, but if you reload the page before the problem is fixed, all unsaved changes will be lost.`}
            </div>
            <br />
            <div>
              <Button onClick={handleAttemptErrorFix}>Attempt fix</Button>
            </div>
          </div>
        ) : null}
        <Map
          onMapDetailsChanged={handleMapDetailsChanged}
          onMapParticipantAdded={handleAddParticipantOnMap}
          onMapParticipantChanged={handleMapParticipantChanged}
          onMapParticipantDeleted={handleMapParticipantDeleted}
          onAreaEffectAdded={handleAreaEffectAdded}
          onAreaEffectChanged={handleAreaEffectChanged}
          onAreaEffectDeleted={handleAreaEffectDeleted}
        />
        <ItemsRow className={classes.Buttons}>
          <LoadMap onNewMapLoaded={handleNewMapUploaded} />
          <Popup
            modal
            trigger={<Button>Delete map</Button>}
            on="click"
            contentStyle={{ width: 'auto' }}
          >
            {close => (
              <>
                <div>Are you sure?</div>
                <br />
                <ItemsRow>
                  <Button onClick={() => handleDeleteMap(close)}>Yes!</Button>
                  <Button onClick={close}>Nooo!</Button>
                </ItemsRow>
              </>
            )}
          </Popup>
        </ItemsRow>
      </div>
    );
  }
  return view;
};

MapDetails.propTypes = {};

export default MapDetails;
