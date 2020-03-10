import React from 'react';
import PropTypes from 'prop-types';
import { faCog, faTimes } from '@fortawesome/free-solid-svg-icons';

import List from '../../../UI/Table/List/List';
import IconButton from '../../../UI/Form/Button/IconButton/IconButton';
import ItemsRow from '../../../UI/ItemsRow/ItemsRow';

import classes from './ParticipantTemplateRow.module.css';

const ParticipantTemplateRow = ({ template, onEdit, onDelete }) => {
  return (
    <tr className={classes.ParticipantTemplateRow}>
      <td className={classes.AvatarCell}>
        {template.avatarUrl != null && template.avatarUrl !== '' ? (
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
      <td>
        <div>{template.speed}</div>
        {template.swimSpeed == null ? null : <div>Swim {template.swimSpeed}</div>}
        {template.climbSpeed == null ? null : <div>Climb {template.climbSpeed}</div>}
        {template.flySpeed == null ? null : <div>Fly {template.flySpeed}</div>}
      </td>
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
      <td>
        <ItemsRow>
          <IconButton icon={faCog} onClick={() => onEdit(template._id)} />
          <IconButton icon={faTimes} onClick={() => onDelete(template._id)} />
        </ItemsRow>
      </td>
    </tr>
  );
};

ParticipantTemplateRow.propTypes = {
  template: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default ParticipantTemplateRow;
