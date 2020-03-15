import React, { useState, useRef, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { isEmpty } from '../../../../../util/helper-methods';
import StringIdGenerator from '../../../../../util/string-id-generator';

import AddMapParticipant from './AddMapParticipant/AddMapParticipant';
import Grid from './Grid/Grid';
import MapParticipant from './MapParticipant/MapParticipant';

import classes from './Map.module.css';
import MapSettings from './MapSettings/MapSettings';
import ItemsRow from '../../../../UI/ItemsRow/ItemsRow';
import IconButton from '../../../../UI/Form/Button/IconButton/IconButton';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import AreaEffectsSetup from './AreaEffects/AreaEffectsSetup/AreaEffectsSetup';
import AreaEffectEdit from './AreaEffects/AreaEffectEdit/AreaEffectEdit';

const Map = ({
  editedEncounter,
  onMapParticipantAdded,
  onMapParticipantChanged,
  onMapParticipantDeleted,
  onMapSettingsChanged
}) => {
  const [horizontalIndices, setHorizontalIndices] = useState([]);
  const [verticalIndices, setVerticalIndices] = useState([]);

  const [showSettings, setShowSettings] = useState(false);

  const [gridCellSize, setGridCellSize] = useState(null);
  const [mapImageSize, setMapImageSize] = useState({ x: 0, y: 0 });
  const [mapImageLoaded, setMapImageLoaded] = useState(false);
  const [dragFromCell, setDragFromCell] = useState(null);
  // const [mapParticipantPositions, setMapParticipantPositions] = useState({});
  const participantsContainerRef = useRef();

  const hasGrid = useCallback(() => {
    return (
      editedEncounter &&
      editedEncounter.map &&
      !isEmpty(editedEncounter.map.gridWidth) &&
      !isEmpty(editedEncounter.map.gridHeight)
    );
  }, [editedEncounter]);

  const handleMapImageLoaded = useCallback(() => {
    setMapImageLoaded(true);
    const mapRect = participantsContainerRef.current.getBoundingClientRect();
    setMapImageSize({
      x: mapRect.right - mapRect.left,
      y: mapRect.bottom - mapRect.top
    });
  }, []);

  useEffect(() => {
    if (hasGrid()) {
      let stringIdGenerator = new StringIdGenerator();
      let horizontalIndices = [];
      for (let i = 0; i < editedEncounter.map.gridWidth; i++) {
        horizontalIndices.push(stringIdGenerator.next());
      }
      setHorizontalIndices(horizontalIndices);

      let verticalIndices = [];
      for (let i = 0; i < editedEncounter.map.gridHeight; i++) {
        verticalIndices.push((i + 1).toString());
      }
      setVerticalIndices(verticalIndices);
    }
  }, [editedEncounter, hasGrid]);

  useEffect(() => {
    if (mapImageLoaded && hasGrid()) {
      const gridCellWidth = mapImageSize.x / editedEncounter.map.gridWidth;
      const gridCellHeight = mapImageSize.y / editedEncounter.map.gridHeight;

      const newGridCellSize = { x: gridCellWidth, y: gridCellHeight };
      setGridCellSize(newGridCellSize);
    } else if (mapImageLoaded && editedEncounter && editedEncounter.map) {
      setGridCellSize(null);
    }
  }, [editedEncounter, mapImageLoaded, mapImageSize, hasGrid]);

  const isOverMap = useCallback((mouseEvent, mapRect) => {
    return (
      mouseEvent.clientX >= mapRect.left &&
      mouseEvent.clientX <= mapRect.right &&
      mouseEvent.clientY >= mapRect.top &&
      mouseEvent.clientY <= mapRect.bottom
    );
  }, []);

  const getMapCoords = useCallback((mapRect, avatarRect) => {
    return {
      x: Math.max(avatarRect.left - mapRect.left, 0),
      y: Math.max(avatarRect.top - mapRect.top, 0)
    };
  }, []);

  const getGridCoords = useCallback(
    mapPos => {
      if (gridCellSize) {
        return {
          x: Math.floor(mapPos.x / gridCellSize.x),
          y: Math.floor(mapPos.y / gridCellSize.y)
        };
      } else {
        return null;
      }
    },
    [gridCellSize]
  );

  const handleNewParticipantDropped = useCallback(
    (participant, mouseEvent, position) => {
      let gridPos;

      const mapRect = participantsContainerRef.current.getBoundingClientRect();
      if (isOverMap(mouseEvent, mapRect)) {
        const avatarRect = mouseEvent.target.getBoundingClientRect();
        let mapPos = getMapCoords(mapRect, avatarRect);

        if (hasGrid()) {
          gridPos = getGridCoords(mapPos);

          if (editedEncounter.map.snapToGrid) {
            mapPos = {
              x: gridPos.x * gridCellSize.x,
              y: gridPos.y * gridCellSize.y
            };
          }
        }

        const newMapParticipant = {
          participantId: participant._id,
          mapX: mapPos.x,
          mapY: mapPos.y,
          infoX: 0,
          infoY: 0,
          gridX: gridPos ? horizontalIndices[gridPos.x] : null,
          gridY: gridPos ? verticalIndices[gridPos.y] : null
        };

        onMapParticipantAdded(newMapParticipant);
      }
    },
    [
      onMapParticipantAdded,
      horizontalIndices,
      verticalIndices,
      hasGrid,
      isOverMap,
      getGridCoords,
      getMapCoords,
      editedEncounter,
      gridCellSize
    ]
  );

  const handleMapParticipantStartDrag = useCallback(participantCoordinate => {
    if (participantCoordinate.gridX && participantCoordinate.gridY) {
      setDragFromCell({
        x: participantCoordinate.gridX,
        y: participantCoordinate.gridY
      });
    }
  }, []);

  const handleMapMarticipantDropped = useCallback(
    (participantCoordinate, mouseEvent, position) => {
      setDragFromCell(null);

      const mapRect = participantsContainerRef.current.getBoundingClientRect();
      if (isOverMap(mouseEvent, mapRect)) {
        let gridPos = null;

        let mapPos = { x: position.x, y: position.y };

        if (hasGrid()) {
          gridPos = getGridCoords(mapPos);

          if (editedEncounter.map.snapToGrid) {
            mapPos = {
              x: gridPos.x * gridCellSize.x,
              y: gridPos.y * gridCellSize.y
            };
          }
        }

        const newCoordinates = {
          ...participantCoordinate,
          mapX: mapPos.x,
          mapY: mapPos.y,
          gridX: gridPos ? horizontalIndices[gridPos.x] : null,
          gridY: gridPos ? verticalIndices[gridPos.y] : null
        };
        console.log('new coordinates calculated on drop', mapPos);
        onMapParticipantChanged(newCoordinates);
      } else {
        onMapParticipantDeleted(participantCoordinate.participantId);
      }
    },
    [
      isOverMap,
      getGridCoords,
      hasGrid,
      horizontalIndices,
      verticalIndices,
      onMapParticipantChanged,
      onMapParticipantDeleted,
      gridCellSize,
      editedEncounter
    ]
  );

  const handleMapParticipantInfoDropped = useCallback(
    (participantCoordinate, newInfoPos) => {
      const newCoordinates = {
        ...participantCoordinate,
        infoX: newInfoPos.x,
        infoY: newInfoPos.y
      };
      onMapParticipantChanged(newCoordinates);
    },
    [onMapParticipantChanged]
  );

  const [areaEffect, setAreaEffect] = useState(null);

  return (
    <>
      {editedEncounter && editedEncounter.map ? (
        <div
          className={classes.Container}
          style={{ width: mapImageSize.x + 'px' }}
        >
          <AreaEffectsSetup onAreaEffectAdd={setAreaEffect} />

          <details className={classes.ControlsContailer}>
            <summary>Participants</summary>
            <div className={classes.ControlsInsides}>
              <ItemsRow className={classes.Controls}>
                {mapImageLoaded
                  ? editedEncounter.participants.map(participant => (
                      <AddMapParticipant
                        key={participant._id}
                        participant={participant}
                        isOnMap={editedEncounter.map.participantCoordinates.some(
                          coordinate =>
                            coordinate.participantId.toString() ===
                            participant._id.toString()
                        )}
                        dropContainerRef={participantsContainerRef}
                        onDropped={(mouseEvent, position) =>
                          handleNewParticipantDropped(
                            participant,
                            mouseEvent,
                            position
                          )
                        }
                      />
                    ))
                  : null}
              </ItemsRow>
            </div>
          </details>

          <MapSettings
            onSettingsChanged={onMapSettingsChanged}
            showSettings={showSettings}
          />

          <div className={classes.MapContainer}>
            <img
              src={editedEncounter.map.mapUrl}
              alt="Map"
              className={classes.MapImage}
              onLoad={handleMapImageLoaded}
              onError={() => setMapImageLoaded(false)}
            />

            {mapImageLoaded ? (
              <div className={classes.MapSettingsIcon}>
                <IconButton
                  icon={faCog}
                  onClick={() => setShowSettings(prev => !prev)}
                />
              </div>
            ) : null}

            {mapImageLoaded && hasGrid() ? (
              <Grid
                showGrid={editedEncounter.map.showGrid}
                gridColor={editedEncounter.map.gridColor}
                horizontalIndices={horizontalIndices}
                verticalIndices={verticalIndices}
                dragFromCell={dragFromCell}
              />
            ) : null}

            <div
              className={classes.ParticipantsContainer}
              ref={participantsContainerRef}
            >
              {mapImageLoaded
                ? editedEncounter.map.participantCoordinates.map(
                    participantCoordinate => (
                      <MapParticipant
                        key={participantCoordinate.participantId.toString()}
                        participantCoordinates={participantCoordinate}
                        participant={editedEncounter.participants.find(
                          participant =>
                            participant._id.toString() ===
                            participantCoordinate.participantId.toString()
                        )}
                        gridCellSize={gridCellSize}
                        onStartDrag={() =>
                          handleMapParticipantStartDrag(participantCoordinate)
                        }
                        onDrop={(mouseEvent, position) =>
                          handleMapMarticipantDropped(
                            participantCoordinate,
                            mouseEvent,
                            position
                          )
                        }
                        onInfoPosChanged={newInfoPos =>
                          handleMapParticipantInfoDropped(
                            participantCoordinate,
                            newInfoPos
                          )
                        }
                        showDead={editedEncounter.map.showDead}
                        showInfo={editedEncounter.map.showInfo}
                      />
                    )
                  )
                : null}
            </div>

            {areaEffect ? (
              <AreaEffectEdit
                areaEffect={areaEffect}
                gridCellSize={gridCellSize}
                mapImageSize={mapImageSize}
              />
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
};

Map.propTypes = {
  onMapParticipantAdded: PropTypes.func.isRequired,
  onMapParticipantChanged: PropTypes.func.isRequired,
  onMapParticipantDeleted: PropTypes.func.isRequired,
  onMapSettingsChanged: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    editedEncounter: state.encounter.editedEncounter
  };
};

export default connect(mapStateToProps)(Map);
