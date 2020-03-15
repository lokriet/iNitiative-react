import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import InlineSelect from '../../../../../../UI/Form/Select/InlineSelect/InlineSelect';
import InlineInput from '../../../../../../UI/Form/Input/InlineInput/InlineInput';
import Button from '../../../../../../UI/Form/Button/Button';

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

const AreaEffectsSetup = ({onAreaEffectAdd}) => {
  const [type, setType] = useState('segment');
  const [name, setName] = useState('');
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(2);
  const [color, setColor] = useState('#ff0000');

  const handleRadiusChanged = useCallback(radius => {
    setWidth(radius);
    setHeight(radius);
  }, []);

  const handleAddAreaEffect = useCallback(() => {
    const newAreaEffect = {
      type,
      name,
      gridWidth: parseFloat(width),
      gridHeight: parseFloat(height),
      color,
    }

    if (type === AreaEffectType.Segment) {
      newAreaEffect.angle = 0;
    }

    console.log('add...', newAreaEffect);

    onAreaEffectAdd(newAreaEffect)
  }, [color, height, width, type, name, onAreaEffectAdd]);

  const handleTypeChanged = useCallback(
    (option) => {
      setType(option.value);

      console.log('handle type changed', type, option.value, type === AreaEffectsSetup.Rectangle, option.value !== type);
      if (type === AreaEffectType.Rectangle && option.value !== type) {
        console.log('set height', width);
        setHeight(width);
      }
    },
    [type, width],
  );

  const handleHeightChanged = useCallback(
    (event) => {
      console.log('handle height changed', event.target.value);
      setHeight(event.target.value);
    },
    [],
  )

  return (
    <div>
      <div>
        <div>Add new</div>
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
        ) : (
          <>
            <label>Radius</label>
            <InlineInput
              type="number"
              min={1}
              name="width"
              hidingBorder
              value={width}
              onChange={event => handleRadiusChanged(event.target.value)}
            />
          </>
        )}

        <div>
          <Button onClick={handleAddAreaEffect}>Add</Button>
        </div>
      </div>
    </div>
  );
};

AreaEffectsSetup.propTypes = {};

export default AreaEffectsSetup;
