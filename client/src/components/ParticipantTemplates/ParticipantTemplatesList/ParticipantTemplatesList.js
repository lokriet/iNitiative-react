import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import ParticipantTemplateRow from './ParticipantTemplateRow/ParticipantTemplateRow';
import ItemsRow from '../../UI/ItemsRow/ItemsRow';
import FilterInput from '../../UI/FilterInput/FilterInput';
import {AddButton} from '../../UI/Form/Button/AddButton/AddButton';
import classes from './ParticipantTemplatesList.module.css';

const ParticipantTemplatesList = props => {
  const allTemplates = [];

  return (
    <div>
      <div className={classes.SearchRow}>
        <ItemsRow centered alignCentered>
          <div><FilterInput allItems={allTemplates} searchField='name' onItemsFiltered={() => {}} /></div>
          <Link to={`/templates/new?type=${props.type}`}><AddButton /></Link>
        </ItemsRow>
      </div>
      <table>
        <thead>
          <tr>
            <th>{/* color */}</th>
            <th>{/* avatar */}</th>
            <th>Name</th>
            <th>Ini</th>
            <th>HP</th>
            <th>AC</th>
            <th>Spd</th>
            <th>Immune</th>
            <th>Resist</th>
            <th>Weak</th>
            <th>Features</th>
            <th>Size</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {allTemplates.map(item => (
            <ParticipantTemplateRow template={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

ParticipantTemplatesList.propTypes = {};

export default ParticipantTemplatesList;
