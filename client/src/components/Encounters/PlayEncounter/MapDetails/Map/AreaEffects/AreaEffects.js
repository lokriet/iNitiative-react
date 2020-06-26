import React from 'react';
import PropTypes from 'prop-types';
import classes from './AreaEffects.module.css';
import AreaEffect from './AreaEffect/AreaEffect';

const AreaEffects = ({ gridCellSize, mapImageSize, areaEffects }) => {
  return (
    <div
      style={{ width: mapImageSize.x, height: mapImageSize.y }}
      className={classes.Container}
    >
      <svg width={mapImageSize.x} height={mapImageSize.y}>
        {areaEffects.map(areaEffect => (
          <g
            key={areaEffect._id}
            style={{
              transform: `translate(${areaEffect.position.x}px,${areaEffect.position.y}px)`
            }}
          >
            <AreaEffect
              areaEffect={areaEffect}
              angle={areaEffect.angle}
              gridCellSize={gridCellSize}
            />
          </g>
        ))}
      </svg>
    </div>
  );
};

AreaEffects.propTypes = {
  gridCellSize: PropTypes.object,
  mapImageSize: PropTypes.object,
  areaEffects: PropTypes.array.isRequired
};

export default AreaEffects;
