import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import InlineSelect from '../../../../../../UI/Form/Select/InlineSelect/InlineSelect';
import InlineInput from '../../../../../../UI/Form/Input/InlineInput/InlineInput';
import Button from '../../../../../../UI/Form/Button/Button';
import classes from './AreaEffectsSetup.module.css';

export const AreaEffectType = {
  Rectangle: 'rectangle',
  Circle: 'circle',
  Segment: 'segment'
};

const typeOptions = [
  { value: AreaEffectType.Rectangle, label: 'Rectangle' },
  { value: AreaEffectType.Circle, label: 'Circle' },
  { value: AreaEffectType.Segment, label: 'Segment' }
];

const AreaEffectsSetup = ({ onApply, onSave, areaEffect }) => {
  const [type, setType] = useState(areaEffect ? areaEffect.type : AreaEffectType.Rectangle);
  const [name, setName] = useState(areaEffect ? areaEffect.name : '');
  const [width, setWidth] = useState(areaEffect ? areaEffect.gridWidth : 2);
  const [height, setHeight] = useState(areaEffect ? areaEffect.gridHeight : 2);
  const [color, setColor] = useState(areaEffect ? areaEffect.color : '#ff0000');

  const handleRadiusChanged = useCallback(radius => {
    setWidth(radius);
    setHeight(radius);
  }, []);

  const handleApply = useCallback(() => {
    const editedAreaEffect = {
      type,
      name,
      gridWidth: parseFloat(width),
      gridHeight: parseFloat(height),
      color,
      angle: areaEffect ? areaEffect.angle : 0,
      position: areaEffect ? areaEffect.position : null
    };

    onApply(editedAreaEffect);
  }, [color, height, width, type, name, onApply, areaEffect]);

  const handleTypeChanged = useCallback(
    option => {
      setType(option.value);

      console.log(
        'handle type changed',
        type,
        option.value,
        type === AreaEffectsSetup.Rectangle,
        option.value !== type
      );
      if (type === AreaEffectType.Rectangle && option.value !== type) {
        console.log('set height', width);
        setHeight(width);
      }
    },
    [type, width]
  );

  const handleHeightChanged = useCallback(event => {
    console.log('handle height changed', event.target.value);
    setHeight(event.target.value);
  }, []);

  return (
    <div>
      <div className={classes.SetupForm}>
        <label>Name</label>
        <InlineInput
          name="name"
          hidingBorder
          value={name}
          onChange={event => setName(event.target.value)}
        />

        <label>Type</label>
        <InlineSelect
          isObjectBased={false}
          name="type"
          options={typeOptions}
          value={typeOptions.find(item => item.value === type)}
          onChange={handleTypeChanged}
        />

        <label>Color</label>
        <input
          type="color"
          value={color}
          onChange={event => setColor(event.target.value)}
        />

        {type === AreaEffectType.Rectangle ? (
          <>
            <label>Width</label>
            <InlineInput
              type="number"
              min={1}
              name="width"
              hidingBorder
              value={width}
              onChange={event => setWidth(event.target.value)}
            />

            <label>Height</label>
            <InlineInput
              type="number"
              min={1}
              name="height"
              hidingBorder
              value={height}
              onChange={event => handleHeightChanged(event)}
            />
          </>
        ) : type === AreaEffectType.Circle ? (
          <>
            <label>Radius</label>
            <InlineInput
              type="number"
              min={1}
              name="radius"
              hidingBorder
              value={width}
              onChange={event => handleRadiusChanged(event.target.value)}
            />
          </>
        ) : (
          <>
            <label>Length</label>
            <InlineInput
              type="number"
              min={1}
              name="length"
              hidingBorder
              value={width}
              onChange={event => handleRadiusChanged(event.target.value)}
            />
          </>
        )}

        <div className={classes.FullRow}>
          <Button onClick={handleApply}>{areaEffect ? 'Apply' : 'Add'}</Button>
          <Button onClick={() => onApply(null)}>Cancel</Button>
          <Button onClick={onSave}>Save</Button>
        </div>
      </div>
    </div>
  );
};

AreaEffectsSetup.propTypes = {
  onApply: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};

export default AreaEffectsSetup;
