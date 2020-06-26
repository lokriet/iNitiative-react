import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import classes from './MapSettings.module.css';
import ItemsRow from '../../../../../../UI/ItemsRow/ItemsRow';
import { useSelector } from 'react-redux';
import InlineInput from '../../../../../../UI/Form/Input/InlineInput/InlineInput';
import { isEmpty } from '../../../../../../../util/helper-methods';
import { selectEditedEncounter } from '../../../../../encounterSlice';

const MapSettings = ({ onSettingsChanged }) => {
  const editedEncounter = useSelector(selectEditedEncounter);

  const handleSettingsChanged = useCallback(
    (settingName, settingValue) => {
      onSettingsChanged({ [settingName]: settingValue });
    },
    [onSettingsChanged]
  );

  const handleGridSizeChanged = useCallback(
    (settingName, settingValue) => {
      if (!isEmpty(settingValue) && (settingValue <= 0 || settingValue > 1000)) {
        return;
      }
      onSettingsChanged({ [settingName]: settingValue })
    },
    [onSettingsChanged],
  )

  return (
      <ItemsRow alignCentered className={classes.MapSettings}>
        <label>Grid color: </label>
        <input
          type="color"
          value={editedEncounter.map.gridColor}
          onChange={event =>
            handleSettingsChanged('gridColor', event.target.value)
          }
        />

        <span>
          <input
            type="checkbox"
            id="showGrid"
            checked={editedEncounter.map.showGrid}
            onChange={event =>
              handleSettingsChanged('showGrid', event.target.checked)
            }
          />
          <label htmlFor="showGrid">Show grid</label>
        </span>

        <span>
          <input
            type="checkbox"
            id="snapToGrid"
            checked={editedEncounter.map.snapToGrid}
            onChange={event =>
              handleSettingsChanged('snapToGrid', event.target.checked)
            }
          />
          <label htmlFor="snapToGrid">Snap to grid</label>
        </span>

        <span>
          <input
            type="checkbox"
            id="showInfo"
            checked={editedEncounter.map.showInfo}
            onChange={event =>
              handleSettingsChanged('showInfo', event.target.checked)
            }
          />
          <label htmlFor="showInfo">Show info</label>
        </span>

        <span>
          <input
            type="checkbox"
            id="showDead"
            checked={editedEncounter.map.showDead}
            onChange={event =>
              handleSettingsChanged('showDead', event.target.checked)
            }
          />
          <label htmlFor="showDead">Show dead</label>
        </span>

        <label>Grid size:</label>
        <span>
          <label htmlFor="gridWidth">W </label>
          <InlineInput
            hidingBorder
            type="number"
            id="gridWidth"
            min={0}
            max={1000}
            className={classes.ShortInput}
            value={editedEncounter.map.gridWidth || ''}
            onChange={event => handleGridSizeChanged('gridWidth', event.target.value)}
          />
        </span>
        <span>
          <label htmlFor="gridHeight">H </label>
          <InlineInput
            hidingBorder
            type="number"
            id="gridHeight"
            min={0}
            max={1000}
            className={classes.ShortInput}
            value={editedEncounter.map.gridHeight || ''}
            onChange={event => handleGridSizeChanged('gridHeight', event.target.value)}
          />
        </span>
      </ItemsRow>
  );
};

MapSettings.propTypes = {
  onSettingsChanged: PropTypes.func.isRequired
};

export default MapSettings;
