import React, {
  useState,
  useEffect,
  Fragment,
  createRef,
  useCallback,
  useRef
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classes from './Map.module.css';
import { isEmpty } from '../../../../../util/helper-methods';
import StringIdGenerator from '../../../../../util/string-id-generator';
import Popup from 'reactjs-popup';
import IconButton from '../../../../UI/Form/Button/IconButton/IconButton';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import Draggable from 'react-draggable';

const Map = ({ editedEncounter }) => {
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const [showDead, setShowDead] = useState(false);
  const [horizontalIndices, setHorizontalIndices] = useState([]);
  const [verticalIndices, setVerticalIndices] = useState([]);

  const participantsContainerRef = useRef();

  useEffect(() => {
    if (
      editedEncounter &&
      editedEncounter.map &&
      !isEmpty(editedEncounter.map.gridWidth) &&
      !isEmpty(editedEncounter.map.gridHeight)
    ) {
      let stringIdGenerator = new StringIdGenerator();
      let horizontalIndices = [];
      for (let i = 0; i < editedEncounter.map.gridWidth; i++) {
        horizontalIndices.push(stringIdGenerator.next());
      }
      setHorizontalIndices(horizontalIndices);

      let verticalIndices = [];
      for (let i = 0; i < editedEncounter.map.gridHeight; i++) {
        verticalIndices.push((i + 1).toString());
      }
      setVerticalIndices(verticalIndices);
    }
  }, [editedEncounter]);

  const handleDragNewParticipant = useCallback((mouseEvent, draggableInfo) => {
    let rect = participantsContainerRef.current.getBoundingClientRect();
    console.log('drag drag', mouseEvent, draggableInfo, rect);
  }, []);

  return (
    <>
      {editedEncounter && editedEncounter.map ? (
        <div className={classes.Container}>
          <div className={classes.MapContainer}>
            <img
              src={editedEncounter.map.mapUrl}
              alt="Map"
              className={classes.MapImage}
            />

            {!isEmpty(editedEncounter.map.gridWidth) &&
            !isEmpty(editedEncounter.map.gridHeight) ? (
              <div
                className={classes.GridContainer}
                style={{
                  gridTemplateColumns:
                    '2rem repeat(' + editedEncounter.map.gridWidth + ', 1fr)',
                  gridTemplateRows:
                    '2rem repeat(' + editedEncounter.map.gridHeight + ', 1fr)'
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
                        className={`${classes.GridCell}`}
                        style={
                          editedEncounter.map.showGrid
                            ? {
                                borderRightColor:
                                  i !== editedEncounter.map.gridWidth - 1
                                    ? editedEncounter.map.gridColor
                                    : 'transparent',
                                borderBottomColor:
                                  j !== editedEncounter.map.gridHeight - 1
                                    ? editedEncounter.map.gridColor
                                    : 'transparent'
                              }
                            : {}
                        }
                      ></div>
                    ))}
                  </Fragment>
                ))}
              </div>
            ) : null}

            <div
              className={classes.ParticipantsContainer}
              ref={participantsContainerRef}
            ></div>
          </div>

          <div className={classes.Controls}>
            <Draggable onDrag={handleDragNewParticipant}>
              <div
                className={classes.AddParticipant}
                style={{
                  backgroundColor: 'green',
                  backgroundImage:
                    'url("https://firebasestorage.googleapis.com/v0/b/initiative-dev.appspot.com/o/images%2F1583733403773_undefined?alt=media&token=fe0ebe57-dc0a-47a8-af99-5fd8f2323b86")'
                }}
              >
              </div>
            </Draggable>
          </div>
        </div>
      ) : null}
    </>
  );
};

Map.propTypes = {};

const mapStateToProps = state => {
  return {
    editedEncounter: state.encounter.editedEncounter
  };
};

export default connect(mapStateToProps)(Map);
