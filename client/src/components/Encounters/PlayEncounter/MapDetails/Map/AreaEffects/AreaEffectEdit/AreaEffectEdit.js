import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { AreaEffectType } from '../AreaEffectsSetup/AreaEffectsSetup';
import Draggable from 'react-draggable';
import classes from './AreaEffectEdit.module.css';
import rotateCursor from '../../../../../../../assets/images/rotate.png';
import * as aoe from '../aoe-utils';
import AreaEffect from '../AreaEffect/AreaEffect';

const AreaEffectEdit = ({
  areaEffect,
  gridCellSize,
  mapImageSize,
  onChange
}) => {
  const getShapeWidth = useCallback(() => {
    return (
      areaEffect.gridWidth *
      (gridCellSize ? gridCellSize.x : aoe.defaultSquareSize)
    );
  }, [areaEffect, gridCellSize]);

  const getShapeHeight = useCallback(() => {
    return (
      areaEffect.gridHeight *
      (gridCellSize ? gridCellSize.y : aoe.defaultSquareSize)
    );
  }, [areaEffect, gridCellSize]);

  const [position, setPosition] = useState(() => {
    if (areaEffect.position) {
      return areaEffect.position;
    } else {
      if (areaEffect.type === AreaEffectType.Rectangle) {
        return {
          x: (mapImageSize.x - getShapeWidth()) / 2,
          y: (mapImageSize.y - getShapeHeight()) / 2
        };
      } else {
        return { x: mapImageSize.x / 2, y: mapImageSize.y / 2 };
      }
    }
  });

  const [angle, setAngle] = useState(areaEffect.angle * (Math.PI / 180));

  const [rotatorPosition, setRotatorPosition] = useState(
    aoe.sum(
      aoe.getEllipsePointCoords(
        getShapeWidth() * aoe.arcRadius,
        getShapeHeight() * aoe.arcRadius,
        angle
      ),
      { x: mapImageSize.x / 2, y: mapImageSize.y / 2 }
    )
  );

  const handleShapeDrag = useCallback((mouseEvent, position) => {
    setPosition({ x: position.x, y: position.y });
    setRotatorPosition(prevRotatorPosition => ({
      x: prevRotatorPosition.x + position.deltaX,
      y: prevRotatorPosition.y + position.deltaY
    }));
  }, []);

  const handleRotatorDrag = useCallback(
    (mouseEvent, newPosition) => {
      const x = newPosition.x - position.x;
      const y = newPosition.y - position.y;
      console.log('x, y', x, y);

      let positionAngle;
      if (x === 0) {
        positionAngle = y > 0 ? -Math.PI / 2 : Math.PI / 2;
      } else {
        positionAngle = -Math.atan(y / x);
      }

      if (x < 0) {
        positionAngle = Math.PI + positionAngle;
      }

      const newAngle = positionAngle;

      setAngle(newAngle);

      const rotatorPos = aoe.sum(
        aoe.getEllipsePointCoords(
          getShapeWidth() * aoe.arcRadius,
          getShapeHeight() * aoe.arcRadius,
          newAngle
        ),
        { x: position.x, y: position.y }
      );
      setRotatorPosition(rotatorPos);
    },
    [position, getShapeHeight, getShapeWidth]
  );

  const handleAreaEffectChanged = useCallback(() => {
    onChange({
      ...areaEffect,
      angle,
      position
    });
  }, [angle, areaEffect, onChange, position]);

  const style = { fill: areaEffect.color, stroke: areaEffect.color };
  let rotator = null;
  if (areaEffect.type === AreaEffectType.Segment) {
    rotator = (
      <circle
        cx={0}
        cy={0}
        r={3}
        style={{ ...style, cursor: `url('${rotateCursor}'),grab` }}
        className={classes.Rotator}
      />
    );
  }

  return (
    <div
      style={{ width: mapImageSize.x, height: mapImageSize.y }}
      className={classes.Container}
    >
      <svg width={mapImageSize.x} height={mapImageSize.y}>
        <Draggable
          position={position}
          onDrag={(mouseEvent, position) =>
            handleShapeDrag(mouseEvent, position)
          }
          onStop={handleAreaEffectChanged}
        >
          <g>
            <AreaEffect
              areaEffect={areaEffect}
              angle={angle}
              gridCellSize={gridCellSize}
            />
          </g>
        </Draggable>
        {rotator ? (
          <Draggable
            position={rotatorPosition}
            onDrag={(mouseEvent, position) =>
              handleRotatorDrag(mouseEvent, position)
            }
            onStop={handleAreaEffectChanged}
          >
            {rotator}
          </Draggable>
        ) : null}
      </svg>
    </div>
  );
};

AreaEffectEdit.propTypes = {
  areaEffect: PropTypes.object.isRequired,
  gridCellSize: PropTypes.object,
  mapImageSize: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export default AreaEffectEdit;
