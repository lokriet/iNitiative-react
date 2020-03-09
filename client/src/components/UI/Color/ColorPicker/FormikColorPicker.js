import React, { useCallback, useState } from 'react';

import Popup from 'reactjs-popup';
import Color from '../Color';
import ColorPicker from './ColorPicker';

import classes from './FormikColorPicker.module.css';

const FormikColorPicker = ({
  field,
  form: { setFieldValue }
}) => {

  const handleColorChange = useCallback(
    async (close, newColor) => {
      await setFieldValue(field.name, newColor);
      close();
    },
    [setFieldValue, field.name]
  );

  return (
    <Popup
      on="click"
      trigger={open => (
        <div className={classes.ColorButton}>
          <Color color={field.value} />
        </div>
      )}
      contentStyle={{ width: 'auto' }}
      offsetY={10}
    >
      {close => (
        <ColorPicker
          selectedColor={field.value}
          onSelected={newColor => handleColorChange(close, newColor)}
          onCancel={close}
        />
      )}
    </Popup>
  );
};

export default FormikColorPicker;
