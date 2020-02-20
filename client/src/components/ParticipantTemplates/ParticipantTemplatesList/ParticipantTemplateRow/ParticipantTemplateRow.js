import React from 'react';
import PropTypes from 'prop-types';
import List from '../../../UI/Table/List/List';
import Color from '../../../UI/Color/Color';

import classes from './ParticipantTemplateRow.module.css';

const ParticipantTemplateRow = ({ template }) => {
  return (
    <tr className={classes.ParticipantTemplateRow}>
      <td>
        <Color color={template.color} />
      </td>
      <td className={classes.AvatarCell}>
        {template.avatarUrl ? (
          <img
            src={template.avatarUrl}
            className={classes.Avatar}
            alt={template.name}
          />
        ) : null}
      </td>
      <td>{template.name}</td>
      <td>{template.initiativeModifier}</td>
      <td>{template.maxHp}</td>
      <td>{template.armorClass}</td>
      <td>{template.speed}</td>
      <td>
        <List items={template.immunities.damageTypes} />
        {template.immunities.damageTypes.length > 0 &&
        template.immunities.conditions.length > 0 ? (
          <div className={classes.Separator}>&mdash;</div>
        ) : null}
        <List items={template.immunities.conditions} />
      </td>
      <td>
        <List items={template.resistances} />
      </td>
      <td>
        <List items={template.vulnerabilities} />
      </td>
      <td>
        <List items={template.features} />
      </td>
      <td>{template.mapSize}</td>
      <td className={classes.Comment}>{template.comment}</td>
    </tr>
  );
};

ParticipantTemplateRow.propTypes = {
  template: PropTypes.object
};

export default ParticipantTemplateRow;
