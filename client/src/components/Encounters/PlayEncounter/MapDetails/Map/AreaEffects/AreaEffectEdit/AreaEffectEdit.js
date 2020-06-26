import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AreaEffectType } from '../aoe-utils';
import Draggable from 'react-draggable';
import classes from './AreaEffectEdit.module.css';
import rotateCursor from '../../../../../../../assets/images/rotate.png';
import * as aoe from '../aoe-utils';
import AreaEffect from '../AreaEffect/AreaEffect';

const AreaEffectEdit = ({
  snapToGrid,
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
  }, [areaEffect.gridWidth, gridCellSize]);

  const getShapeHeight = useCallback(() => {
    return (
      areaEffect.gridHeight *
      (gridCellSize ? gridCellSize.y : aoe.defaultSquareSize)
    );
  }, [areaEffect.gridHeight, gridCellSize]);

  const snapPosToGrid = useCallback(
    pos => {
      if (snapToGrid) {
        const newPos = {
          x:
            pos.x -
            (pos.x % (gridCellSize ? gridCellSize.x : aoe.defaultSquareSize)),
          y:
            pos.y -
            (pos.y % (gridCellSize ? gridCellSize.y : aoe.defaultSquareSize))
        };
        return newPos;
      } else {
        return pos;
      }
    },
    [snapToGrid, gridCellSize]
  );

  const getPos = useCallback(() => {
    if (areaEffect.position) {
      return areaEffect.position;
    } else {
      let newPos;
      if (areaEffect.type === AreaEffectType.Rectangle) {
        newPos = {
          x: (mapImageSize.x - getShapeWidth()) / 2,
          y: (mapImageSize.y - getShapeHeight()) / 2
        };
      } else {
        newPos = { x: mapImageSize.x / 2, y: mapImageSize.y / 2 };
      }
      return snapPosToGrid(newPos);
    }
  }, [
    areaEffect.position,
    areaEffect.type,
    mapImageSize,
    getShapeHeight,
    getShapeWidth,
    snapPosToGrid
  ]);

  const [position, setPosition] = useState(getPos());

  const [angle, setAngle] = useState(areaEffect.angle);

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

  useEffect(() => {
    let newPosition = getPos();
    if (!areaEffect.position) {
      onChange({ ...areaEffect, position: newPosition });
    }

    setPosition(newPosition);

    if (areaEffect.type === AreaEffectType.Segment) {
      setRotatorPosition(
        aoe.sum(
          aoe.getEllipsePointCoords(
            getShapeWidth() * aoe.arcRadius,
            getShapeHeight() * aoe.arcRadius,
            areaEffect.angle
          ),
          newPosition
        )
      );
    }
  }, [
    areaEffect,
    getShapeWidth,
    getShapeHeight,
    mapImageSize,
    onChange,
    getPos
  ]);

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
    let newPos = position;
    if (areaEffect.position.x !== position.x || areaEffect.position.y !== position.y) {
      newPos = snapPosToGrid(position);
    }

    onChange({
      ...areaEffect,
      angle,
      position: newPos
    });
  }, [angle, areaEffect, onChange, position, snapPosToGrid]);

  let rotator = null;
  if (areaEffect.type === AreaEffectType.Segment) {
    rotator = (
      <circle
        cx={0}
        cy={0}
        r={3}
        style={{ cursor: `url('${rotateCursor}'),grab` }}
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
        <rect
          x={0}
          y={0}
          width={mapImageSize.x}
          height={mapImageSize.y}
          className={classes.Background}
        />
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
              highlight
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
  snapToGrid: PropTypes.bool,
  areaEffect: PropTypes.object.isRequired,
  gridCellSize: PropTypes.object,
  mapImageSize: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export default AreaEffectEdit;
