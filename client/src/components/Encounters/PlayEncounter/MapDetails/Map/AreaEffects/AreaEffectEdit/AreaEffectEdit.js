import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { AreaEffectType } from '../AreaEffectsSetup/AreaEffectsSetup';
import Draggable from 'react-draggable';
import classes from './AreaEffectEdit.module.css';
import rotateCursor from '../../../../../../../assets/images/rotate.png';

const defaultSquareSize = 32;
const arcRadius = Math.sqrt(1.25);
const vertexAngle = Math.atan(0.5);

const AreaEffectEdit = ({ areaEffect, gridCellSize, mapImageSize }) => {
  const [position, setPosition] = useState(() => {
    if (areaEffect.position) {
      return areaEffect.position;
    } else {
      if (areaEffect.type === AreaEffectType.Rectangle) {
        //TODO
        return { x: mapImageSize.x / 2, y: mapImageSize.y / 2 };
      } else {
        return { x: mapImageSize.x / 2, y: mapImageSize.y / 2 };
      }
    }
  });

  const [shapeMapWidth, setShapeMapWidth] = useState(
    areaEffect.gridWidth * (gridCellSize ? gridCellSize.x : defaultSquareSize)
  );
  const [shapeMapHeight, setShapeMapHeight] = useState(
    areaEffect.gridHeight * (gridCellSize ? gridCellSize.y : defaultSquareSize)
  );

  const [angle, setAngle] = useState(areaEffect.angle * (Math.PI / 180));

  const [rotatorPosition, setRotatorPosition] = useState(null);

  useEffect(() => {
    setShapeMapWidth(
      areaEffect.gridWidth * (gridCellSize ? gridCellSize.x : defaultSquareSize)
    );
    setShapeMapHeight(
      areaEffect.gridHeight *
        (gridCellSize ? gridCellSize.y : defaultSquareSize)
    );

    setAngle(areaEffect.angle * (Math.PI / 180));

    let newPosition;
    if (areaEffect.position) {
      newPosition = areaEffect.position;
    } else {
      if (areaEffect.type === AreaEffectType.Rectangle) {
        //TODO
        newPosition = { x: mapImageSize.x / 2, y: mapImageSize.y / 2 };
      } else {
        newPosition = { x: mapImageSize.x / 2, y: mapImageSize.y / 2 };
      }
    }
    setPosition(newPosition);

    const newRotatorPosition = {
      x: Math.cos(angle) * (shapeMapWidth * arcRadius + 15),
      y: -Math.sin(angle) * (shapeMapHeight * arcRadius + 15)
    };
    console.log('set rotator position', newRotatorPosition);
    setRotatorPosition(newRotatorPosition);
  }, [areaEffect, gridCellSize, mapImageSize, angle, shapeMapHeight, shapeMapWidth]);

  const handleShapeDrag = useCallback((mouseEvent, position) => {
    setPosition({ x: position.x, y: position.y });
  }, []);

  const handleRotatorDrag = useCallback(
    (mouseEvent, newPosition) => {
      // console.log(mouseEvent, newPosition, position);
        const x = newPosition.x - position.x;
        const y = -(newPosition.y - position.y);
        const newAngle =
          x === 0 ? (y > 0 ? Math.PI / 2 : -Math.PI / 2) : Math.atan(y / x);
        console.log((newAngle * 180) / Math.PI);
        setAngle(newAngle);


    },
    []
  );

  const style = { fill: areaEffect.color, stroke: areaEffect.color };
  // console.log(
  //   'shape size',
  //   shapeMapWidth,
  //   shapeMapHeight,
  //   gridCellSize,
  //   areaEffect
  // );
  let shape;
  let rotator = null;
  switch (areaEffect.type) {
    case AreaEffectType.Rectangle:
      shape = (
        <rect
          className={classes.Shape}
          x={0}
          y={0}
          width={shapeMapWidth}
          height={shapeMapHeight}
          style={style}
        />
      );
      break;
    case AreaEffectType.Circle:
      shape = (
        <ellipse
          className={classes.Shape}
          cx={0}
          cy={0}
          rx={shapeMapWidth}
          ry={shapeMapHeight}
          style={style}
        />
      );
      break;
    case AreaEffectType.Segment:
      const angleStart = angle - vertexAngle;
      const angleEnd = angle + vertexAngle;

      const arcStartPosX = Math.cos(angleStart) * shapeMapWidth * arcRadius;
      const arcStartPosY = -Math.sin(angleStart) * shapeMapHeight * arcRadius;
      const arcEndPosX = Math.cos(angleEnd) * shapeMapWidth * arcRadius;
      const arcEndPosY = -Math.sin(angleEnd) * shapeMapHeight * arcRadius;

      const path = `M 0 0 L ${arcStartPosX} ${arcStartPosY} L ${arcEndPosX} ${arcEndPosY} Z`;
      // console.log(path);

      shape = <path d={path} style={style} className={classes.Shape} />;

      if (rotatorPosition) {
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
      break;
    default:
      shape = null;
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
        >
          {shape}
        </Draggable>
        {rotator ? (
          <Draggable
            position={rotatorPosition}
            onDrag={(mouseEvent, position) =>
              handleRotatorDrag(mouseEvent, position)
            }
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
  mapImageSize: PropTypes.object
};

export default AreaEffectEdit;
