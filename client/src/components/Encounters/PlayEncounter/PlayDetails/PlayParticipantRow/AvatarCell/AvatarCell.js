import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import classes from './AvatarCell.module.css';
import Color from '../../../../../UI/Color/Color';
import Popup from 'reactjs-popup';
import ColorPicker from '../../../../../UI/Color/ColorPicker/ColorPicker';
import { isEmpty } from '../../../../../../util/helper-methods';

const AvatarCell = ({ participant, onColorChanged }) => {
  const handleColorChange = useCallback(
    (close, newColor) => {
      onColorChanged(newColor);
      close();
    },
    [onColorChanged]
  );

  return (
    <Popup
      on="click"
      trigger={open => (
        <div className={classes.Avatar}>
          {!isEmpty(participant.avatarUrl) ? (
            <img
              src={participant.avatarUrl}
              alt={participant.name}
              className={classes.Avatar}
              style={
                isEmpty(participant.color)
                  ? {}
                  : { borderColor: participant.color }
              }
            />
          ) : !isEmpty(participant.color) ? (
            <Color color={participant.color} />
          ) : null}
        </div>
      )}
      position="bottom left"
      offsetY={10}
      contentStyle={{ width: 'auto' }}
    >
      {close => (
        <ColorPicker
          selectedColor={participant.color}
          onSelected={newColor => handleColorChange(close, newColor)}
          onCancel={close}
        />
      )}
    </Popup>
  );
};

AvatarCell.propTypes = {};

export default AvatarCell;
