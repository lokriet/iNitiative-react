import React, { useCallback, useState } from 'react';
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
                <Button onClick={() => handleDeleteMap(close)}>Yes!</Button>
              </>
            )}
          </Popup>
        </ItemsRow>
        {/* <div>
          {props.editedEncounter.map ? (
            <img src={props.editedEncounter.map.mapUrl} alt="map" />
          ) : null}
        </div> */}
        <Map />
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
