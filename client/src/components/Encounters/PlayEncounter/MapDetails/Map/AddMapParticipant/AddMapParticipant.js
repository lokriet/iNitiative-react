import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';
import classes from './AddMapParticipant.module.css';
import MapAvatar from '../MapAvatar/MapAvatar';
import Popup from 'reactjs-popup';

const AddMapParticipant = ({ participant, isOnMap, onDropped }) => {
  const [draggablePosition, setDraggablePosition] = useState({ x: 0, y: 0 });

  const handleDrag = useCallback((mouseEvent, position) => {
    setDraggablePosition({ x: position.x, y: position.y });
  }, []);

  const handleDrop = useCallback(
    (mouseEvent, position) => {
      onDropped(mouseEvent, position);
      setDraggablePosition({ x: 0, y: 0 });
    },
    [onDropped]
  );

  return (
    <Popup
      on="hover"
      position="top center"
      arrow={false}
      contentStyle={{ width: 'auto', zIndex: 11 }}
      offsetY={10}
      trigger={
        <div className={`${classes.Container}`}>
          <MapAvatar participant={participant} width="3rem" height="3rem" />
          <Draggable
            onDrag={handleDrag}
            onStop={handleDrop}
            position={draggablePosition}
            defaultClassNameDragging={classes.Dragging}
            disabled={isOnMap}
          >
            <div
              className={`${classes.Draggable} ${
                isOnMap ? classes.DraggingDisabled : null
              }`}
            >
              <MapAvatar participant={participant} width="3rem" height="3rem" className={isOnMap ? classes.DisabledAvatar : null} />
            </div>
          </Draggable>
        </div>
      }
    >
      <div className={classes.PopupName}>{participant.name}</div>
    </Popup>
  );
};

AddMapParticipant.propTypes = {
  participant: PropTypes.object.isRequired,
  isOnMap: PropTypes.bool.isRequired,
  onDropped: PropTypes.func.isRequired
};

export default AddMapParticipant;
