import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch, connect } from 'react-redux';

import * as actions from '../../../store/actions';

import ParticipantTemplateRow from './ParticipantTemplateRow/ParticipantTemplateRow';
import ItemsRow from '../../UI/ItemsRow/ItemsRow';
import FilterInput from '../../UI/FilterInput/FilterInput';
import { AddButton } from '../../UI/Form/Button/AddButton/AddButton';

import classes from './ParticipantTemplatesList.module.css';

const ParticipantTemplatesList = props => {
  const [allTemplates, setAllTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState(allTemplates);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.getParticipantTemplates());
  }, [dispatch]);

  useEffect(() => {
    const allTemplates = props.participantTemplates.filter(item => item.type === props.type);
    setAllTemplates(allTemplates);
    setFilteredTemplates(allTemplates)
  }, [props.type, props.participantTemplates]);

  const handleItemsFiltered = useCallback(filteredItems => {
    setFilteredTemplates(filteredItems);
  }, []);
  
  return (
    <div>
      <div className={classes.SearchRow}>
        <ItemsRow centered alignCentered>
          <div>
            <FilterInput
              allItems={allTemplates}
              searchField="name"
              onItemsFiltered={handleItemsFiltered}
            />
          </div>
          <Link to={`/templates/new?type=${props.type}`}>
            <AddButton />
          </Link>
        </ItemsRow>
      </div>
      <table className={classes.Table}>
        <thead>
          <tr className={classes.TableHeader}>
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
          {filteredTemplates.map(item => (
            <ParticipantTemplateRow key={item._id} template={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

ParticipantTemplatesList.propTypes = {
  type: PropTypes.string.isRequired
};

const mapStateToProps = state => {
  return {
    participantTemplates: state.participantTemplate.participantTemplates,
    error: state.participantTemplate.error,
    errors: state.participantTemplate.errors,
    fetching: state.participantTemplate.fetching
  };
};

export default connect(mapStateToProps)(ParticipantTemplatesList);
