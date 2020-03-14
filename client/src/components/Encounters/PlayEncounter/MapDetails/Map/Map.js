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

const Map = ({
  editedEncounter,
  onMapParticipantAdded,
  onMapParticipantChanged,
  onMapParticipantDeleted,
  onMapSettingsChanged
}) => {
  const [mapSettings, setMapSettings] = useState(null);

  const [horizontalIndices, setHorizontalIndices] = useState([]);
  const [verticalIndices, setVerticalIndices] = useState([]);

  const [gridCellSize, setGridCellSize] = useState(null);
  const [mapImageLoaded, setMapImageLoaded] = useState(false);

  const [dragFromCell, setDragFromCell] = useState(null);

  const [mapParticipantPositions, setMapParticipantPositions] = useState({});

  const participantsContainerRef = useRef();

  const hasGrid = useCallback(() => {
    return (
      editedEncounter &&
      editedEncounter.map &&
      !isEmpty(editedEncounter.map.gridWidth) &&
      !isEmpty(editedEncounter.map.gridHeight)
    );
  }, [editedEncounter]);

  useEffect(() => {
    if (!mapSettings && editedEncounter && editedEncounter.map) {
      setMapSettings({
        gridColor: editedEncounter.map.gridColor,
        snapToGrid: true,
        showGrid: editedEncounter.map.showGrid,
        showInfo: true,
        showDead: false,
        gridWidth: editedEncounter.map.gridWidth,
        gridHeight: editedEncounter.map.gridHeight
      });
    }
  }, [editedEncounter, mapSettings]);

  const handleMapSettingsChanged = useCallback(
    newSettings => {
      setMapSettings(newSettings);
      onMapSettingsChanged(newSettings);
    },
    [onMapSettingsChanged]
  );

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
      const mapRect = participantsContainerRef.current.getBoundingClientRect();
      const gridCellWidth =
        (mapRect.right - mapRect.left) / editedEncounter.map.gridWidth;
      const gridCellHeight =
        (mapRect.bottom - mapRect.top) / editedEncounter.map.gridHeight;

      setGridCellSize({ x: gridCellWidth, y: gridCellHeight });
    }
  }, [editedEncounter, mapImageLoaded, hasGrid]);

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
        const mapPos = getMapCoords(mapRect, avatarRect);

        if (hasGrid()) {
          gridPos = getGridCoords(mapPos);
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
      getMapCoords
    ]
  );

  const handleMapParticipantStartDrag = useCallback(participantCoordinate => {
    console.log('started dragging', participantCoordinate);
    if (participantCoordinate.gridX && participantCoordinate.gridY) {
      setDragFromCell({
        x: participantCoordinate.gridX,
        y: participantCoordinate.gridY
      });
    }
  }, []);

  const handleMapParticipantDrag = useCallback(
    (participantCoordinate, mouseEvent, position) => {
      setMapParticipantPositions(prevPositions => ({
        ...prevPositions,
        [participantCoordinate.participantId]: {
          x: position.x,
          y: position.y
        }
      }));
    },
    []
  );

  const handleMapMarticipantDropped = useCallback(
    (participantCoordinate, mouseEvent, position) => {
      setDragFromCell(null);

      const mapRect = participantsContainerRef.current.getBoundingClientRect();
      if (isOverMap(mouseEvent, mapRect)) {
        let gridPos = null;

        const avatarRect = mouseEvent.target.getBoundingClientRect();
        let mapPos = getMapCoords(mapRect, avatarRect);

        if (hasGrid()) {
          gridPos = getGridCoords(mapPos);

          if (mapSettings.snapToGrid) {
            mapPos = {
              x: gridPos.x * gridCellSize.x,
              y: gridPos.y * gridCellSize.y
            };
          }
        }

        setMapParticipantPositions(prevPositions => ({
          ...prevPositions,
          [participantCoordinate.participantId]: {
            x: mapPos.x,
            y: mapPos.y
          }
        }));

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
        setMapParticipantPositions(prevPositions => {
          let newPositions = { ...prevPositions };
          delete newPositions[participantCoordinate.participantId];
          return newPositions;
        });
      }
    },
    [
      isOverMap,
      getGridCoords,
      getMapCoords,
      hasGrid,
      horizontalIndices,
      verticalIndices,
      onMapParticipantChanged,
      onMapParticipantDeleted,
      gridCellSize,
      mapSettings
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
    [onMapParticipantChanged],
  )

  return (
    <>
      {editedEncounter && editedEncounter.map ? (
        <div className={classes.Container}>
          <div className={classes.MapContainer}>
            <img
              src={editedEncounter.map.mapUrl}
              alt="Map"
              className={classes.MapImage}
              onLoad={() => setMapImageLoaded(true)}
              onError={() => setMapImageLoaded(false)}
            />

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
                        position={
                          mapParticipantPositions[
                            participantCoordinate.participantId
                          ]
                        }
                        gridCellSize={gridCellSize}
                        onStartDrag={() =>
                          handleMapParticipantStartDrag(participantCoordinate)
                        }
                        onDrag={(mouseEvent, position) =>
                          handleMapParticipantDrag(
                            participantCoordinate,
                            mouseEvent,
                            position
                          )
                        }
                        onDrop={(mouseEvent, position) =>
                          handleMapMarticipantDropped(
                            participantCoordinate,
                            mouseEvent,
                            position
                          )
                        }
                        onInfoPosChanged={(newInfoPos) =>
                          handleMapParticipantInfoDropped(
                            participantCoordinate,
                            newInfoPos
                          )
                        }
                        showDead={mapSettings.showDead}
                      />
                    )
                  )
                : null}
            </div>

            {mapImageLoaded && mapSettings ? (
              <div className={classes.MapSettings}>
                <MapSettings
                  mapSettings={mapSettings}
                  onSettingsChanged={handleMapSettingsChanged}
                />
              </div>
            ) : null}
          </div>

          <div className={classes.Controls}>
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
