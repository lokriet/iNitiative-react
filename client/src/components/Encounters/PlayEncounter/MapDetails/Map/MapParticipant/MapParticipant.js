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
  onDrag,
  onDrop,
  onInfoPosChanged,
  showDead,
  showInfo,
  position
}) => {
  const [width, setWidth] = useState(`${participant.mapSize}rem`);
  const [height, setHeight] = useState(`${participant.mapSize}rem`);

  const [combinedInfoPosition, setCombinedInfoPosition] = useState({
    x: participantCoordinates.infoX + participantCoordinates.mapX,
    y: participantCoordinates.infoY + participantCoordinates.mapY
  });

  useEffect(() => {
    setCombinedInfoPosition({
      x:
        participantCoordinates.infoX +
        (position ? position.x : participantCoordinates.mapX),
      y:
        participantCoordinates.infoY +
        (position ? position.y : participantCoordinates.mapY)
    });
  }, [
    participantCoordinates.infoX,
    participantCoordinates.infoY,
    position,
    participantCoordinates.mapX,
    participantCoordinates.mapY
  ]);

  useEffect(() => {
    if (gridCellSize) {
      setWidth(`${gridCellSize.x * participant.mapSize}px`);
      setHeight(`${gridCellSize.y * participant.mapSize}px`);
    }
  }, [gridCellSize, participant.mapSize]);

  const handleInfoDrag = useCallback((mouseEvent, position) => {
    setCombinedInfoPosition({ x: position.x, y: position.y });
  }, []);

  const handleInfoDrop = useCallback(
    (mouseEvent, position) => {
      setCombinedInfoPosition({ x: position.x, y: position.y });
      console.log('info pos changed in map participant');
      onInfoPosChanged({
        x: position.x - participantCoordinates.mapX,
        y: position.y - participantCoordinates.mapY
      });
    },
    [participantCoordinates.mapX, participantCoordinates.mapY, onInfoPosChanged]
  );

  return !showDead && participant.currentHp <= 0 ? null : (
    <div className={classes.Container}>
      <Draggable
        onStart={onStartDrag}
        onStop={onDrop}
        onDrag={onDrag}
        position={
          position || {
            x: participantCoordinates.mapX,
            y: participantCoordinates.mapY
          }
        }
      >
        <div className={classes.DraggableAvatar}>
          <MapAvatar participant={participant} width={width} height={height} />
        </div>
      </Draggable>

      {showInfo ? (
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
  onDrag: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  onInfoPosChanged: PropTypes.func.isRequired,
  showDead: PropTypes.bool,
  showInfo: PropTypes.bool,
  position: PropTypes.object
};

export default MapParticipant;
