import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import classes from './AreaEffect.module.css';
import * as aoe from '../aoe-utils';
import { AreaEffectType } from '../aoe-utils';

const AreaEffect = ({areaEffect, highlight, angle, gridCellSize}) => {
  const getShapeWidth = useCallback(() => {
    return areaEffect.gridWidth * (gridCellSize ? gridCellSize.x : aoe.defaultSquareSize);
  }, [areaEffect, gridCellSize]);

  const getShapeHeight = useCallback(() => {
    return areaEffect.gridHeight * (gridCellSize ? gridCellSize.y : aoe.defaultSquareSize);
  }, [areaEffect, gridCellSize]);
  
  const style = { fill: areaEffect.color, stroke: highlight ? 'white' : areaEffect.color };
  let shape;
  switch (areaEffect.type) {
    case AreaEffectType.Rectangle:
      shape = (
        <rect
          className={classes.Shape}
          x={0}
          y={0}
          width={getShapeWidth()}
          height={getShapeHeight()}
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
          rx={getShapeWidth()}
          ry={getShapeHeight()}
          style={style}
        />
      );
      break;
    case AreaEffectType.Segment:
      const angleStart = angle - aoe.vertexAngle;
      const angleEnd = angle + aoe.vertexAngle;

      const arcStartPos = aoe.getEllipsePointCoords(
        getShapeWidth() * aoe.arcRadius,
        getShapeHeight() * aoe.arcRadius,
        angleStart
      );
      const arcEndPos = aoe.getEllipsePointCoords(
        getShapeWidth() * aoe.arcRadius,
        getShapeHeight() * aoe.arcRadius,
        angleEnd
      );

      const path = `M 0 0 L ${arcStartPos.x} ${arcStartPos.y} L ${arcEndPos.x} ${arcEndPos.y} Z`;

      shape = <path d={path} style={style} className={classes.Shape} />;
      break;
    default:
      shape = null;
  }


  return shape;
}

AreaEffect.propTypes = {
  areaEffect: PropTypes.object,
  angle: PropTypes.number,
  highlight: PropTypes.bool,
  gridCellSize: PropTypes.object
}

export default AreaEffect
