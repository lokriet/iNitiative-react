import React, { useState, useRef, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { isEmpty } from '../../../../../util/helper-methods';
import StringIdGenerator from '../../../../../util/string-id-generator';

import Grid from './Grid/Grid';
import MapParticipant from './MapParticipant/MapParticipant';

import classes from './Map.module.css';
import AreaEffectEdit from './AreaEffects/AreaEffectEdit/AreaEffectEdit';
import MapControls from './MapControls/MapControls';
import AreaEffects from './AreaEffects/AreaEffects';
import { sum } from './AreaEffects/aoe-utils';

const isOverMap = (mouseEvent, mapRect) => {
  return (
    mouseEvent.clientX >= mapRect.left &&
    mouseEvent.clientX <= mapRect.right &&
    mouseEvent.clientY >= mapRect.top &&
    mouseEvent.clientY <= mapRect.bottom
  );
};

const getMapCoords = (mapRect, avatarRect) => {
  return {
    x: Math.max(avatarRect.left - mapRect.left, 0),
    y: Math.max(avatarRect.top - mapRect.top, 0)
  };
};

const Map = ({
  editedEncounter,
  onMapParticipantAdded,
  onMapParticipantChanged,
  onMapParticipantDeleted,
  onMapDetailsChanged,

  onAreaEffectAdded,
  onAreaEffectChanged,
  onAreaEffectDeleted
}) => {
  const [horizontalIndices, setHorizontalIndices] = useState([]);
  const [verticalIndices, setVerticalIndices] = useState([]);

  const [gridCellSize, setGridCellSize] = useState(null);
  const [mapImageSize, setMapImageSize] = useState({ x: 0, y: 0 });
  const [mapImageLoaded, setMapImageLoaded] = useState(false);
  const [dragFromCell, setDragFromCell] = useState(null);
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
    if (
      hasGrid() &&
      (editedEncounter.map.gridWidth !== horizontalIndices.length ||
        editedEncounter.map.gridHeight !== verticalIndices.length)
    ) {
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
  }, [
    editedEncounter,
    hasGrid,
    horizontalIndices.length,
    verticalIndices.length
  ]);

  useEffect(() => {
    if (mapImageLoaded && hasGrid()) {
      console.log('calculating grid cell size');
      const gridCellWidth = mapImageSize.x / editedEncounter.map.gridWidth;
      const gridCellHeight = mapImageSize.y / editedEncounter.map.gridHeight;

      const newGridCellSize = { x: gridCellWidth, y: gridCellHeight };
      setGridCellSize(newGridCellSize);
    } else if (mapImageLoaded && editedEncounter && editedEncounter.map) {
      setGridCellSize(null);
    }
  }, [editedEncounter, mapImageLoaded, mapImageSize, hasGrid]);

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

  // Participants handling start
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
      getGridCoords,
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
        
        onMapParticipantChanged(newCoordinates);
      } else {
        onMapParticipantDeleted(participantCoordinate.participantId);
      }
    },
    [
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
  // Participants handling end

  // AoE start
  const [editedAreaEffect, setEditedAreaEffect] = useState(null);

  const handleAreaEffectSave = useCallback(() => {
    if ('_id' in editedAreaEffect) {
      onAreaEffectChanged(editedAreaEffect);
    } else {
      onAreaEffectAdded(editedAreaEffect);
    }
    setEditedAreaEffect(null);
  }, [onAreaEffectChanged, onAreaEffectAdded, editedAreaEffect]);
  // AoE end

  return (
    <>
      {editedEncounter && editedEncounter.map ? (
        <div
          className={classes.Container}
          style={{ width: mapImageSize.x + 'px' }}
        >
          {mapImageLoaded ? (
            <div className={classes.ControlsContainer}>
              <MapControls
                onNewParticipantDropped={handleNewParticipantDropped}
                onMapSettingsChanged={onMapDetailsChanged}
                editedAreaEffect={editedAreaEffect}
                onAreaEffectChanged={setEditedAreaEffect}
                onAreaEffectSaved={handleAreaEffectSave}
                onAreaEffectDeleted={onAreaEffectDeleted}
              />
            </div>
          ) : null}

          <div className={classes.MapContainer}>
            <img
              src={editedEncounter.map.mapUrl}
              alt="Map"
              className={classes.MapImage}
              onLoad={handleMapImageLoaded}
              onError={() => setMapImageLoaded(false)}
              ref={participantsContainerRef}
            />

            {mapImageLoaded ? (
              <>
                {hasGrid() ? (
                  <Grid
                    showGrid={editedEncounter.map.showGrid}
                    gridColor={editedEncounter.map.gridColor}
                    horizontalIndices={horizontalIndices}
                    verticalIndices={verticalIndices}
                    dragFromCell={dragFromCell}
                  />
                ) : null}

                <div className={classes.ParticipantsContainer}>
                  {editedEncounter.map.participantCoordinates.map(
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
                  )}
                </div>

                {editedAreaEffect ? (
                  <AreaEffectEdit
                    areaEffect={editedAreaEffect}
                    gridCellSize={gridCellSize}
                    mapImageSize={mapImageSize}
                    onChange={setEditedAreaEffect}
                  />
                ) : null}

                <AreaEffects
                  mapImageSize={mapImageSize}
                  gridCellSize={gridCellSize}
                  areaEffects={editedEncounter.map.areaEffects.filter(item => {
                    if (!editedAreaEffect || !editedAreaEffect._id) {
                      return true;
                    } else {
                      return (
                        item._id.toString() !== editedAreaEffect._id.toString()
                      );
                    }
                  })}
                />
              </>
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

  onMapDetailsChanged: PropTypes.func.isRequired,

  onAreaEffectAdded: PropTypes.func.isRequired,
  onAreaEffectChanged: PropTypes.func.isRequired,
  onAreaEffectDeleted: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    editedEncounter: state.encounter.editedEncounter
  };
};

export default connect(mapStateToProps)(Map);
