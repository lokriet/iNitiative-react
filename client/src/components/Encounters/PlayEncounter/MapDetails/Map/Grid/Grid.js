import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classes from './Grid.module.css';

const Grid = ({
  showGrid,
  gridColor,
  horizontalIndices,
  verticalIndices,
  dragFromCell
}) => {

  return (
    <div
      className={classes.GridContainer}
      style={{
        gridTemplateColumns:
          '2rem repeat(' + horizontalIndices.length + ', 1fr)',
        gridTemplateRows: '2rem repeat(' + verticalIndices.length + ', 1fr)'
      }}
    >
      <div className={classes.GridCell}>{/* Top left corner */}</div>

      {/* Top row of cell indices (letters) */}
      {horizontalIndices.map((horizontalIndex, i) => (
        <div
          key={`${i}-top`}
          className={`${classes.GridCell} ${classes.ColumnName}`}
        >
          {horizontalIndex}
        </div>
      ))}

      {verticalIndices.map((verticalIndex, j) => (
        <Fragment key={j}>
          {/* left cell index (number) */}
          <div
            key={`left-${j}`}
            className={`${classes.GridCell} ${classes.RowName}`}
          >
            {verticalIndex}
          </div>

          {/* row of grid cells */}
          {horizontalIndices.map((horizontalIndex, i) => (
            <div
              key={`${i}${j}`}
              className={`${classes.GridCell} ${
                dragFromCell &&
                horizontalIndex === dragFromCell.x &&
                verticalIndex === dragFromCell.y
                  ? classes.DragFromCell
                  : ''
              }`}
              style={
                showGrid
                  ? {
                      borderRightColor:
                        i !== horizontalIndices.length - 1
                          ? gridColor
                          : 'transparent',
                      borderBottomColor:
                        j !== verticalIndices.length - 1
                          ? gridColor
                          : 'transparent'
                    }
                  : {}
              }
            ></div>
          ))}
        </Fragment>
      ))}
    </div>
  );
};

Grid.propTypes = {
  showGrid: PropTypes.bool.isRequired,
  gridColor: PropTypes.string,
  horizontalIndices: PropTypes.array.isRequired,
  verticalIndices: PropTypes.array.isRequired,
  dragFromCell: PropTypes.object
};

export default Grid;
