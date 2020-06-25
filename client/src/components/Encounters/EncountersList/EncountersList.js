import React, { useCallback, useEffect } from 'react';
import { useDispatch,  useSelector } from 'react-redux';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import withAuthCheck from '../../../hoc/withAuthCheck';
import {fetchEncounters, deleteEncounter, resetEncounterOperation, selectAll} from '../encounterSlice';

import { useHistory } from 'react-router-dom';
import EncounterRow from './EncounterRow/EncounterRow';
import IconButton from '../../UI/Form/Button/IconButton/IconButton';
import ServerError from '../../UI/Errors/ServerError/ServerError';

import classes from './EncountersList.module.css';
import Spinner from '../../UI/Spinner/Spinner';

const EncountersList = () => {
  const allEncounters = useSelector(selectAll);
  const fetching = useSelector(state => state.encounter.fetching);
  const fetchingError = useSelector(state => state.encounter.fetchingError);
  const operationError = useSelector(state => state.encounter.operationError);

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(fetchEncounters());
  }, [dispatch])

  const handleNewEncounter = useCallback((encounterId) => {
    history.push(`/encounters/new`);
  }, [history]);

  const handleEditEncounter = useCallback((encounterId) => {
    history.push(`/encounters/edit/${encounterId}`);
  }, [history]);

  const handlePlayEncounter = useCallback((encounterId) => {
    history.push(`/encounters/play/${encounterId}`);
  }, [history]);
  
  const handleDeleteEncounter = useCallback((encounterId) => {
    dispatch(deleteEncounter(encounterId))
  }, [dispatch]);

  const handleCancelDeleteEncounter = useCallback(() => {
    dispatch(resetEncounterOperation());
  }, [dispatch]);

  let view;
  if (fetching) {
    view = <Spinner />;
  } else if (fetchingError) {
    view = <ServerError serverError={fetchingError.message} />;
  } else {
    view = (
      <>
        <div className={classes.NewButton}>
          <IconButton icon={faPlus} onClick={handleNewEncounter}>Start a new one!</IconButton>
        </div>
        <table className={classes.Table}>
          <thead>
            <tr className={classes.TableHeader}>
              <th>Name</th>
              <th>Created</th>
              <th>Modified</th>
              <th>{/* action buttons */}</th>
            </tr>
          </thead>
          <tbody>
            {allEncounters.map(item => (
              <EncounterRow
                key={item._id}
                encounter={item}
                serverError={operationError}
                onDelete={handleDeleteEncounter}
                onDeleteCancelled={handleCancelDeleteEncounter}
                onEdit={handleEditEncounter}
                onPlay={handlePlayEncounter}
              />
            ))}
          </tbody>
        </table>
      </>
    );
  }

  return view;
};

EncountersList.propTypes = {};

export default withAuthCheck(EncountersList);
