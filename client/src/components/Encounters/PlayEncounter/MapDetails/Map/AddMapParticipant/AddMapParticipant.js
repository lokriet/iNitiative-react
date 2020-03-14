import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from '../../../../../../util/helper-methods';
import ItemsRow from '../../../../../UI/ItemsRow/ItemsRow';
import Draggable from 'react-draggable';
import classes from './AddMapParticipant.module.css';

const AddMapParticipant = ({
  participant,
  isOnMap,
  onDropped
}) => {
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
    <ItemsRow alignCentered className={classes.Container}>
      <div
        className={classes.Avatar}
        style={{
          backgroundColor: isEmpty(participant.color)
            ? 'transparent'
            : participant.color,
          bprderColor: isEmpty(participant.color)
            ? 'transparent'
            : participant.color,
          backgroundImage: isEmpty(participant.avatarUrl)
            ? 'unset'
            : `url(${participant.avatarUrl})`
        }}
      >
        {isEmpty(participant.avatarUrl) ? (
          <div className={classes.FirstLetter}>
            {participant.name.substring(0, 1).toUpperCase()}
          </div>
        ) : null}
      </div>
      <div className={classes.Name}>{participant.name}</div>
      <Draggable
        onDrag={handleDrag}
        onStop={handleDrop}
        position={draggablePosition}
        defaultClassNameDragging={classes.Dragging}
        disabled={isOnMap}
      >
        <div
          className={`${classes.Avatar} ${classes.Draggable} ${
            isOnMap ? classes.DraggingDisabled : null
          }`}
          style={{
            backgroundColor: isEmpty(participant.color)
              ? 'transparent'
              : participant.color,
            backgroundImage: isEmpty(participant.avatarUrl)
              ? 'unset'
              : `url(${participant.avatarUrl})`
          }}
        >
          {isEmpty(participant.avatarUrl) ? (
            <div className={classes.FirstLetter}>
              {participant.name.substring(0, 1).toUpperCase()}
            </div>
          ) : null}
        </div>
      </Draggable>
    </ItemsRow>
  );
};

AddMapParticipant.propTypes = {
  participant: PropTypes.object.isRequired,
  isOnMap: PropTypes.bool.isRequired,
  onDropped: PropTypes.func.isRequired
};

export default AddMapParticipant;
