import React from 'react';
import PropTypes from 'prop-types';
import List from '../../../UI/Table/List/List';
import Color from '../../../UI/Color/Color';

import classes from './ParticipantTemplateRow.module.css';

const ParticipantTemplateRow = ({ template }) => {
  return (
    <tr>
      <td>
        <Color color={template.color} />
      </td>
      <td>
        <img
          src={template.avatarUrl}
          className={classes.Avatar}
          alt={template.name}
        />
      </td>
      <td>{template.name}</td>
      <td>{template.initiativeModifier}</td>
      <td>{template.maxHp}</td>
      <td>{template.armorClass}</td>
      <td>{template.speed}</td>
      <td>
        <List items={template.damageTypeImmunities} />
        <List items={template.conditionImmunities} />
      </td>
      <td>
        <List items={template.resistances} />
      </td>
      <td>
        <List items={template.weaknesses} />
      </td>
      <td>
        <List items={template.features} />
      </td>
      <td>{template.mapSize}</td>
      <td>{template.comments}</td>
    </tr>
  );
};

ParticipantTemplateRow.propTypes = {
  template: PropTypes.object
};

export default ParticipantTemplateRow;
