import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchTemplates,
  deleteTemplate,
  resetTemplateOperation,
  selectParticipantTemplatesByType
} from '../store/participantTemplateSlice';

import ParticipantTemplateRow from './ParticipantTemplateRow/ParticipantTemplateRow';
import ItemsRow from '../../UI/ItemsRow/ItemsRow';
import FilterInput from '../../UI/FilterInput/FilterInput';
import AddButton from '../../UI/Form/Button/AddButton/AddButton';

import classes from './ParticipantTemplatesList.module.css';
import Spinner from '../../UI/Spinner/Spinner';
import Error from '../../UI/Errors/Error/Error';

const ParticipantTemplatesList = ({ type }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { error, fetching } = useSelector((state) => state.participantTemplate);
  const allTemplates = useSelector((state) =>
    selectParticipantTemplatesByType(state, type)
  );
  const [filteredTemplates, setFilteredTemplates] = useState([]);

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  useEffect(() => {
    setFilteredTemplates(allTemplates);
  }, [allTemplates]);

  const handleItemsFiltered = useCallback((filteredItems) => {
    setFilteredTemplates(filteredItems);
  }, []);

  const handleEditTemplate = useCallback(
    (templateId) => {
      history.push(`/templates/edit/${templateId}`);
    },
    [history]
  );

  const handleDeleteTemplate = useCallback(
    (template) => {
      dispatch(deleteTemplate(template));
    },
    [dispatch]
  );

  const handleCancelDeleteTemplate = useCallback(() => {
    dispatch(resetTemplateOperation());
  }, [dispatch]);

  return (
    <div>
      <div className={classes.SearchRow}>
        <ItemsRow centered alignCentered>
          <div>
            <FilterInput
              allItems={allTemplates}
              onItemsFiltered={handleItemsFiltered}
            />
          </div>
          <Link to={`/templates/new?type=${type}`}>
            <AddButton />
          </Link>
        </ItemsRow>
      </div>

      {fetching ? (
        <Spinner />
      ) : error ? (
        <Error>{error.message}</Error>
      ) : (
        <table className={classes.Table}>
          <thead>
            <tr className={classes.TableHeader}>
              <th>{/* avatar */}</th>
              <th>Name</th>
              <th>Ini</th>
              <th>HP</th>
              <th>AC</th>
              <th>Spd</th>
              <th>Immune</th>
              <th>Resist</th>
              <th>Vulnerable</th>
              <th>Features</th>
              <th>Size</th>
              <th>Comment</th>
              <th>{/* action buttons */}</th>
            </tr>
          </thead>
          <tbody>
            {filteredTemplates.map((item) => (
              <ParticipantTemplateRow
                key={item._id}
                template={item}
                onDelete={handleDeleteTemplate}
                onDeleteCancelled={handleCancelDeleteTemplate}
                onEdit={handleEditTemplate}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

ParticipantTemplatesList.propTypes = {
  type: PropTypes.string.isRequired
};

export default ParticipantTemplatesList;
