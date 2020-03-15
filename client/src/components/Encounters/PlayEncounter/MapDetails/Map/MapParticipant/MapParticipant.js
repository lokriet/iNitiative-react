import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';
import classes from './MapParticipant.module.css';
import { ParticipantType } from '../../../../../ParticipantTemplates/ParticipantTemplates';
import List from '../../../../../UI/Table/List/List';
import MapAvatar from '../MapAvatar/MapAvatar';

const MapParticipant = ({
  participant,
  participantCoordinates,
  gridCellSize,
  onStartDrag,
  onDrop,
  onInfoPosChanged,
  showDead,
  showInfo
}) => {
  const [width, setWidth] = useState(`${participant.mapSize * 2}rem`);
  const [height, setHeight] = useState(`${participant.mapSize * 2}rem`);

  const [isDragging, setIsDragging] = useState(false);

  const [combinedInfoPosition, setCombinedInfoPosition] = useState({
    x: participantCoordinates.infoX + participantCoordinates.mapX,
    y: participantCoordinates.infoY + participantCoordinates.mapY
  });

  const [position, setPosition] = useState({
    x: participantCoordinates.mapX,
    y: participantCoordinates.mapY
  });

  useEffect(() => {
    console.log('coords changed in map participant', participantCoordinates.mapX, participantCoordinates.mapY);
    if (!isDragging) {
      setPosition({
        x: participantCoordinates.mapX,
        y: participantCoordinates.mapY
      });

      setCombinedInfoPosition({
        x: participantCoordinates.infoX + participantCoordinates.mapX,
        y: participantCoordinates.infoY + participantCoordinates.mapY
      });
    }
  }, [
    isDragging,
    participantCoordinates
  ]);

  useEffect(() => {
    if (gridCellSize) {
      setWidth(`${gridCellSize.x * participant.mapSize}px`);
      setHeight(`${gridCellSize.y * participant.mapSize}px`);
    } else {
      setWidth(`${participant.mapSize * 2}rem`);
      setHeight(`${participant.mapSize * 2}rem`);
    }
  }, [gridCellSize, participant.mapSize]);

  const handleInfoDrag = useCallback((mouseEvent, position) => {
    setCombinedInfoPosition({ x: position.x, y: position.y });
  }, []);

  const handleInfoDrop = useCallback(
    (mouseEvent, position) => {
      setCombinedInfoPosition({ x: position.x, y: position.y });
      onInfoPosChanged({
        x: position.x - participantCoordinates.mapX,
        y: position.y - participantCoordinates.mapY
      });
    },
    [participantCoordinates.mapX, participantCoordinates.mapY, onInfoPosChanged]
  );

  const handleStartAvatarDrag = useCallback(
    (mouseEvent, position) => {
      setIsDragging(true);
      onStartDrag(mouseEvent, position);
    },
    [onStartDrag]
  );

  const handleAvatarDrag = useCallback((mouseEvent, position) => {
    setPosition(position.x, position.y);
  }, []);

  const handleDropAvatar = useCallback(
    (mouseEvent, position) => {
      setIsDragging(false);
      setCombinedInfoPosition({
        x: participantCoordinates.infoX + position.x,
        y: participantCoordinates.infoY + position.y
      });
      onDrop(mouseEvent, position);
    },
    [onDrop, participantCoordinates.infoX, participantCoordinates.infoY]
  );

  return !showDead && participant.currentHp <= 0 ? null : (
    <div className={classes.Container}>
      <Draggable
        onStart={handleStartAvatarDrag}
        onStop={handleDropAvatar}
        onDrag={handleAvatarDrag}
        position={position}
      >
        <div className={classes.DraggableAvatar}>
          <MapAvatar participant={participant} width={width} height={height} />
        </div>
      </Draggable>

      {showInfo && !isDragging ? (
        <Draggable
          position={combinedInfoPosition}
          onDrag={handleInfoDrag}
          onStop={handleInfoDrop}
        >
          <div className={classes.Info}>
            <div className={classes.Hp}>
              {participant.type === ParticipantType.Player
                ? `HP: ${participant.currentHp} / ${participant.maxHp}`
                : `Dmg: ${participant.maxHp - participant.currentHp}`}
            </div>
            {participant.conditions.length === 0 ? null : (
              <div className={classes.Conditions}>
                <List items={participant.conditions} />
              </div>
            )}
          </div>
        </Draggable>
      ) : null}
    </div>
  );
};

MapParticipant.propTypes = {
  participant: PropTypes.object.isRequired,
  participantCoordinates: PropTypes.object.isRequired,
  gridCellSize: PropTypes.object,
  onStartDrag: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  onInfoPosChanged: PropTypes.func.isRequired,
  showDead: PropTypes.bool,
  showInfo: PropTypes.bool,
  position: PropTypes.object
};

export default MapParticipant;
