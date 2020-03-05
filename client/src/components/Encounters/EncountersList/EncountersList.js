import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, connect } from 'react-redux';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import withAuthCheck from '../../../hoc/withAuthCheck';
import * as actions from '../../../store/actions';

import { Link } from 'react-router-dom';
import EncounterRow from './EncounterRow/EncounterRow';
import IconButton from '../../UI/Form/Button/IconButton/IconButton';
import ServerError from '../../UI/Errors/ServerError/ServerError';

import classes from './EncountersList.module.css';
import Spinner from '../../UI/Spinner/Spinner';

const EncountersList = props => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.getEncounters());
  }, [dispatch])

  const handleEditEncounter = useCallback(() => {}, []);
  const handlePlayEncounter = useCallback(() => {}, []);
  
  const handleDeleteEncounter = useCallback((encounterId) => {
    console.log('deleting');
    dispatch(actions.deleteEncounter(encounterId))
  }, [dispatch]);

  const handleCancelDeleteEncounter = useCallback(() => {
    dispatch(actions.resetEncounterOperation());
  }, [dispatch]);

  let view;
  if (props.fetching) {
    view = <Spinner />;
  } else if (props.fetchingError) {
    view = <ServerError serverError={props.error} />;
  } else {
    view = (
      <>
        <div className={classes.NewButton}>
          <Link to="/encounters/new">
            <IconButton icon={faPlus}>Start a new one!</IconButton>
          </Link>
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
            {props.allEncounters.map(item => (
              <EncounterRow
                key={item._id}
                encounter={item}
                serverError={props.operationError}
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

const mapStateToProps = state => {
  return {
    allEncounters: state.encounter.encounters,
    fetching: state.encounter.fetching,
    fetchingError: state.encounter.fetchingError,
    operationError: state.encounter.operationError
  };
};

export default connect(mapStateToProps)(withAuthCheck(EncountersList));
