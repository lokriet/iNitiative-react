import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import InlineSelect from '../../../../../../../UI/Form/Select/InlineSelect/InlineSelect';
import InlineInput from '../../../../../../../UI/Form/Input/InlineInput/InlineInput';
import Button from '../../../../../../../UI/Form/Button/Button';
import classes from './EditAreaEffectForm.module.css';
import useDebounce from '../../../../../../../../hooks/useDebounce';
import ItemsRow from '../../../../../../../UI/ItemsRow/ItemsRow';

import { AreaEffectType } from '../../aoe-utils';

const typeOptions = [
  { value: AreaEffectType.Rectangle, label: 'Rectangle' },
  { value: AreaEffectType.Circle, label: 'Circle' },
  { value: AreaEffectType.Segment, label: 'Segment' }
];

const EditAreaEffectForm = ({
  onAdd,
  onEdit,
  onCancel,
  onSave,
  areaEffect
}) => {
  const [editedId, setEditedId] = useState(areaEffect ? areaEffect._id || areaEffect._tempId : null);

  const [type, setType] = useState(
    areaEffect ? areaEffect.type : AreaEffectType.Rectangle
  );
  const [name, setName] = useState(areaEffect ? areaEffect.name : '');
  const debouncedName = useDebounce(name, 1000, 'name');

  const [width, setWidth] = useState(areaEffect ? areaEffect.gridWidth : 2);
  const debouncedWidth = useDebounce(width, 500, 'width');

  const [height, setHeight] = useState(areaEffect ? areaEffect.gridHeight : 2);
  const debouncedHeight = useDebounce(height, 500, 'height');

  const [color, setColor] = useState(areaEffect ? areaEffect.color : '#ff0000');

  const [pauseUpdates, setPauseUpdates] = useState(false);

  useEffect(() => {
    if (!pauseUpdates && areaEffect && areaEffect._id === editedId) {

      let partialUpdate = {};
      if (debouncedName !== areaEffect.name) {
        partialUpdate.name = debouncedName;
      }
      if (debouncedWidth !== areaEffect.gridWidth) {
        partialUpdate.gridWidth = debouncedWidth;
      }
      if (debouncedHeight !== areaEffect.gridHeight) {
        partialUpdate.gridHeight = debouncedHeight;
      }

      if (Object.keys(partialUpdate).length > 0) {
        onEdit(partialUpdate);
      }
    }
  }, [
    debouncedName,
    debouncedWidth,
    debouncedHeight,
    areaEffect,
    editedId,
    onEdit,
    pauseUpdates
  ]);

  //reset form on changing areaEffect
  useEffect(() => {
    if (areaEffect && editedId !== areaEffect._id) {
      setType(areaEffect.type);
      setName(areaEffect.name);
      setWidth(areaEffect.gridWidth);
      setHeight(areaEffect.gridHeight);
      setColor(areaEffect.color);
      setEditedId(areaEffect._id);
    }
    if (!areaEffect && editedId !== null) {
      setType(AreaEffectType.Rectangle);
      setName('');
      setWidth(2);
      setHeight(2);
      setColor('#ff0000');
      setEditedId(null);
    }
    setPauseUpdates(true);

    setTimeout(() => {
      setPauseUpdates(false);
    }, 1000);
  }, [areaEffect, editedId]);

  const handleRadiusChanged = useCallback(radius => {
    setWidth(radius);
    setHeight(radius);
  }, []);

  const handleAdd = useCallback(() => {
    const editedAreaEffect = {
      type,
      name,
      gridWidth: parseFloat(width),
      gridHeight: parseFloat(height),
      color,
      angle: areaEffect ? areaEffect.angle : 0,
      position: areaEffect ? areaEffect.position : null
    };
    // console.log('add area effect', editedAreaEffect);
    onAdd(editedAreaEffect);
  }, [color, height, width, type, name, onAdd, areaEffect]);

  const handleTypeChanged = useCallback(
    option => {
      const newType = option.value;
      setType(newType);

      if (type === AreaEffectType.Rectangle && newType !== type) {
        setHeight(width);
      }

      if (areaEffect) {
        onEdit({
          type: newType,
          gridWidth: parseFloat(width),
          gridHeight: parseFloat(width)
        });
      }
    },
    [type, width, onEdit, areaEffect]
  );

  const handleColorChanged = useCallback(
    event => {
      setColor(event.target.value);
      if (areaEffect) {
        onEdit({ color: event.target.value });
      }
    },
    [onEdit, areaEffect]
  );

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
        <input type="color" value={color} onChange={handleColorChanged} />

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
              onChange={event => setHeight(event.target.value)}
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

        <ItemsRow className={classes.FullRow}>
          {areaEffect ? (
            <>
              <Button onClick={onSave}>Save</Button>
            </>
          ) : (
            <Button onClick={handleAdd}>Add</Button>
          )}
          <Button onClick={onCancel}>Cancel</Button>
        </ItemsRow>
      </div>
    </div>
  );
};

EditAreaEffectForm.propTypes = {
  areaEffect: PropTypes.object,
  onAdd: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};

export default EditAreaEffectForm;
