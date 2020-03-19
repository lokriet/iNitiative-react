import React, { useCallback, useState } from 'react';

import ItemsRow from '../../../UI/ItemsRow/ItemsRow';
import Button from '../../../UI/Form/Button/Button';
import LoadMap from './LoadMap/LoadMap';
import { connect, useDispatch } from 'react-redux';
import Spinner from '../../../UI/Spinner/Spinner';
import ServerError from '../../../UI/Errors/ServerError/ServerError';
import Popup from 'reactjs-popup';
import * as actions from '../../../../store/actions';
import { EditedEncounterAction } from '../../../../store/actions';
import { isEmpty } from '../../../../util/helper-methods';
import Map from './Map/Map';
import classes from './MapDetails.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { sum } from './Map/AreaEffects/aoe-utils';

const MapDetails = props => {
  const dispatch = useDispatch();

  const handleDeleteMap = useCallback(
    close => {
      if (props.editedEncounter) {
        if (props.editedEncounter.map) {
          props.firebase.doDeleteImage(props.editedEncounter.map.mapUrl);
          dispatch(
            actions.editEncounter(
              props.editedEncounter._id,
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
    [props.editedEncounter, dispatch, props.firebase]
  );

  const handleNewMapUploaded = useCallback(
    mapInfo => {
      if (props.editedEncounter) {
        if (props.editedEncounter.map) {
          props.firebase.doDeleteImage(props.editedEncounter.map.mapUrl);
        }
      }

      dispatch(
        actions.editEncounter(
          props.editedEncounter._id,
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
    [dispatch, props.editedEncounter, props.firebase]
  );

  const handleAddParticipantOnMap = useCallback(
    newMapParticipant => {
      dispatch(
        actions.editEncounter(
          props.editedEncounter._id,
          {
            map: {
              ...props.editedEncounter.map,
              participantCoordinates: props.editedEncounter.map.participantCoordinates.concat(
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
    [dispatch, props.editedEncounter]
  );

  const handleMapParticipantChanged = useCallback(
    editedMapParticipant => {
      const initialMapParticipant = props.editedEncounter.map.participantCoordinates.find(
        item =>
          item.participantId.toString() ===
          editedMapParticipant.participantId.toString()
      );

      let newAreaEffects = props.editedEncounter.map.areaEffects;
      if (
        editedMapParticipant.mapX !== initialMapParticipant.mapX ||
        editedMapParticipant.mapY !== initialMapParticipant.mapY
      ) {
        const moveVector = {
          x: editedMapParticipant.mapX - initialMapParticipant.mapX,
          y: editedMapParticipant.mapY - initialMapParticipant.mapY
        };

        newAreaEffects = props.editedEncounter.map.areaEffects.map(areaEffect => {
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
        });
      }

      dispatch(
        actions.editEncounter(
          props.editedEncounter._id,
          {
            map: {
              ...props.editedEncounter.map,
              participantCoordinates: props.editedEncounter.map.participantCoordinates.map(
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
    [dispatch, props.editedEncounter]
  );

  const handleMapParticipantDeleted = useCallback(
    participantId => {
      const newAreaEffects = props.editedEncounter.map.areaEffects.filter(
        areaEffect =>
          !areaEffect.followingParticipantId ||
          areaEffect.followingParticipantId.toString() !==
            participantId.toString()
      );

      dispatch(
        actions.editEncounter(
          props.editedEncounter._id,
          {
            map: {
              ...props.editedEncounter.map,
              participantCoordinates: props.editedEncounter.map.participantCoordinates.filter(
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
    [dispatch, props.editedEncounter]
  );

  const handleMapDetailsChanged = useCallback(
    mapDetails => {
      dispatch(
        actions.editEncounter(
          props.editedEncounter._id,
          {
            map: {
              ...props.editedEncounter.map,
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
    [dispatch, props.editedEncounter]
  );

  const handleAreaEffectAdded = useCallback(
    areaEffect => {
      dispatch(
        actions.editEncounter(
          props.editedEncounter._id,
          {
            map: {
              ...props.editedEncounter.map,
              areaEffects: [
                ...props.editedEncounter.map.areaEffects,
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
    [dispatch, props.editedEncounter]
  );

  const handleAreaEffectChanged = useCallback(
    areaEffect => {
      dispatch(
        actions.editEncounter(
          props.editedEncounter._id,
          {
            map: {
              ...props.editedEncounter.map,
              areaEffects: props.editedEncounter.map.areaEffects.map(item =>
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
    [dispatch, props.editedEncounter]
  );

  const handleAreaEffectDeleted = useCallback(
    areaEffectId => {
      dispatch(
        actions.editEncounter(
          props.editedEncounter._id,
          {
            map: {
              ...props.editedEncounter.map,
              areaEffects: props.editedEncounter.map.areaEffects.filter(
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
    [dispatch, props.editedEncounter]
  );

  const handleAttemptErrorFix = useCallback(() => {
    dispatch(
      actions.editEncounter(
        props.editedEncounter._id,
        {
          ...props.editedEncounter
        },
        { editedEncounterAction: EditedEncounterAction.Set }
      )
    );
  }, [dispatch, props.editedEncounter]);

  let view;
  if (!props.editedEncounter && !props.fetchingEncounterError) {
    view = <Spinner />;
  } else if (props.fetchingEncounterError) {
    view = <ServerError serverError={props.fetchingEncounterError} />;
  } else {
    view = (
      <div className={classes.Container}>
        {props.saveError ? (
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

const mapStateToProps = state => {
  return {
    firebase: state.auth.firebase,

    saveError: state.encounter.operationError,
    saveSuccess: state.encounter.operationSuccess,
    editedEncounter: state.encounter.editedEncounter,
    fetchingEncounterError: state.encounter.fetchingError
  };
};

export default connect(mapStateToProps)(MapDetails);
