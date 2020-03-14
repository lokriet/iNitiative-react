import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

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

              participantCoordinates: []
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

  const handleMapParticipantDeleted = useCallback(
    participantId => {
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

  const handleMapSettingsChanged = useCallback(
    (mapSettings) => {
      dispatch(
        actions.editEncounter(
          props.editedEncounter._id,
          {
            map: {
              ...props.editedEncounter.map,
              gridColor: mapSettings.gridColor,
              gridWidth: mapSettings.gridWidth,
              gridHeight: mapSettings.gridHeight,
              showGrid: mapSettings.showGrid
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
    [dispatch, props.editedEncounter],
  )

  let view;
  if (!props.editedEncounter && !props.fetchingEncounterError) {
    view = <Spinner />;
  } else if (props.fetchingEncounterError) {
    view = <ServerError serverError={props.fetchingEncounterError} />;
  } else {
    view = (
      <div>
        <ItemsRow>
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
                  <Button onClick={close}>Nooo!</Button>
                  <Button onClick={() => handleDeleteMap(close)}>Yes!</Button>
                </ItemsRow>
              </>
            )}
          </Popup>
        </ItemsRow>
        <Map
          onMapSettingsChanged={handleMapSettingsChanged}
          onMapParticipantAdded={handleAddParticipantOnMap}
          onMapParticipantChanged={handleMapParticipantChanged}
          onMapParticipantDeleted={handleMapParticipantDeleted}
        />
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
