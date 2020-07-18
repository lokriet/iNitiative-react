import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Color from '../Color';

import classes from './ColorPicker.module.css';
import ItemsRow from '../../ItemsRow/ItemsRow';
import Button from '../../Form/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@fortawesome/free-solid-svg-icons';

const presetColors = [
  '#f6402c',
  '#eb1460',
  '#9c1ab1',
  '#6633b9',
  '#3d4db7',
  '#46af4a',
  '#009687',
  '#00bbd5',
  '#00a6f6',
  '#1093f5',
  '#88c440',
  '#ccdd1e',
  '#ffec16',
  '#ffc100',
  '#ff9800',
  '#000000',
  '#5e7c8b',
  '#9d9d9d',
  '#ff5505'
];

const ColorPicker = (props) => {
  const [currentSelection, setCurrentSelection] = useState(props.selectedColor);

  return (
    <div className={classes.Container}>
      <div className={classes.ColorsGrid}>
        <div
          className={`${currentSelection == null ? classes.Active : ''} ${
            classes.ColorCell
          }`}
          onClick={() => setCurrentSelection(null)}
        >
          <FontAwesomeIcon icon={faBan} className={classes.NoColor} />
        </div>
        {presetColors.map((presetColor) => (
          <Color
            color={presetColor}
            key={presetColor}
            className={`${
              presetColor === currentSelection ? classes.Active : ''
            } ${classes.ColorCell}`}
            onClick={() => setCurrentSelection(presetColor)}
          />
        ))}
      </div>
      <ItemsRow className={classes.OtherColorRow}>
        <label htmlFor="color">Other: </label>
        <input
          type="color"
          value={currentSelection || ''}
          onChange={(event) => setCurrentSelection(event.target.value)}
          name="color"
          id="color"
        />
      </ItemsRow>
      <ItemsRow>
        <Button
          onClick={() => props.onSelected(currentSelection)}
          data-test="ok-button"
        >
          Ok
        </Button>
        <Button onClick={props.onCancel} data-test="cancel-button">
          Cancel
        </Button>
      </ItemsRow>
    </div>
  );
};

ColorPicker.propTypes = {
  selectedColor: PropTypes.string,
  onSelected: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default ColorPicker;
