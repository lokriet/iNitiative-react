import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import Popup from 'reactjs-popup';
import Button from '../../../../UI/Form/Button/Button';
import ImageUpload from '../../../../ImageUpload/ImageUpload';
import InlineInput from '../../../../UI/Form/Input/InlineInput/InlineInput';
import ItemsRow from '../../../../UI/ItemsRow/ItemsRow';
import classes from './LoadMap.module.css';
import { isEmpty } from '../../../../../util/helper-methods';
import Error from '../../../../UI/Errors/Error/Error';
import { connect } from 'react-redux';

const LoadMap = ({ onNewMapLoaded, firebase }) => {
  const [gridWidth, setGridWidth] = useState('');
  const [gridHeight, setGridHeight] = useState('');
  const [loadedMapInfo, setLoadedMapInfo] = useState(null);
  const [gridSizeError, setGridSizeError] = useState(false);

  const handleMapUploaded = useCallback((mapUrl, mapSize) => {
    console.log('Map uploaded', mapUrl, mapSize);
    if (loadedMapInfo) {
      firebase.doDeleteImage(loadedMapInfo.mapUrl);
    }
    setLoadedMapInfo({
      mapUrl,
      mapWidth: mapSize ? mapSize.width : null,
      mapHeight: mapSize ? mapSize.height : null
    });
  }, [firebase, loadedMapInfo]);

  const handleConfirmNewMap = useCallback(
    close => {
      setGridSizeError(false);
      if (loadedMapInfo) {
        if (
          (!isEmpty(gridWidth) && parseFloat(gridWidth) <= 0) ||
          parseFloat(gridWidth) > 1000
        ) {
          setGridSizeError(true);
          return;
        }
        if (
          (!isEmpty(gridHeight) && parseFloat(gridHeight) <= 0) ||
          parseFloat(gridHeight) > 1000
        ) {
          setGridSizeError(true);
          return;
        }

        onNewMapLoaded({
          mapUrl: loadedMapInfo.mapUrl,
          mapWidth: loadedMapInfo.mapWidth,
          mapHeight: loadedMapInfo.mapHeight,
          gridWidth,
          gridHeight
        });

        setLoadedMapInfo(null);
        close();
      }
    },
    [loadedMapInfo, onNewMapLoaded, gridWidth, gridHeight]
  );

  const handleCancelMapUpload = useCallback(
    (close) => {
      if (loadedMapInfo) {
        firebase.doDeleteImage(loadedMapInfo.mapUrl);
      }
      close();
    },
    [firebase, loadedMapInfo],
  )

  return (
    <Popup
      trigger={<Button>Load new map</Button>}
      on="click"
      position="bottom left"
      closeOnEscape={false}
      closeOnDocumentClick={false}
      contentStyle={{ width: 'auto' }}
    >
      {close => (
        <div className={classes.PopupContainer}>
          <div className={classes.PopupHeader}>Load new map</div>
          <div>
            Uploading a new map image will reset all participants locations!
          </div>
          <br />
          <ImageUpload
            maxWidth={2000}
            maxHeight={1500}
            maxFileSize={5 * 1024}
            onUploadFinished={handleMapUploaded}
            buttonClassName={classes.ChooseFileButton}
            showFileName
          >
            Choose file
          </ImageUpload>
          <div className={classes.FileSizeWarning}>
            No more than 5Mb per image pls!
          </div>
          <ItemsRow alignCentered className={classes.PaddedRow}>
            <label>Grid size</label>
          </ItemsRow>
          <ItemsRow alignCentered className={classes.PaddedRow}>
            <label htmlFor="gridWidth">W:</label>
            <InlineInput
              hidingBorder
              className={classes.GridSizeInput}
              type="number"
              id="gridWidth"
              name="gridWidth"
              min={1}
              max={1000}
              value={gridWidth}
              onChange={event => setGridWidth(event.target.value)}
            />
            <div> x </div>
            <label htmlFor="gridHeight">H:</label>
            <InlineInput
              hidingBorder
              className={classes.GridSizeInput}
              type="number"
              id="gridHeight"
              name="gridHeight"
              min={1}
              max={1000}
              value={gridHeight}
              onChange={event => setGridHeight(event.target.value)}
            />
          </ItemsRow>
          {gridSizeError ? (
            <div className={classes.PaddedRow}>
              <Error>Grid size should be positive</Error>
            </div>
          ) : null}
          <ItemsRow>
            <Button
              onClick={() => handleConfirmNewMap(close)}
              disabled={loadedMapInfo == null}
            >
              Ok
            </Button>
            <Button onClick={() => handleCancelMapUpload(close)}>Cancel</Button>
          </ItemsRow>
        </div>
      )}
    </Popup>
  );
};

LoadMap.propTypes = {
  onNewMapLoaded: PropTypes.func.isRequired,
  currentMapUrl: PropTypes.string
};

const mapStateToProps = state => {
  return {
    firebase: state.auth.firebase
  };
};

export default connect(mapStateToProps)(LoadMap);
