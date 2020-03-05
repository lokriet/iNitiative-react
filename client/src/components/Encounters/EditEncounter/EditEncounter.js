import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import * as actions from '../../../store/actions';
import withAuthCheck from '../../../hoc/withAuthCheck';

import Button from '../../UI/Form/Button/Button';
import ServerError from '../../UI/Errors/ServerError/ServerError';
import ServerValidationError from '../../UI/Errors/ServerValidationError/ServerValidationError';

import classes from './EditEncounter.module.css';
import { useDispatch, connect } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import ItemsRow from '../../UI/ItemsRow/ItemsRow';

const EditEncounter = props => {
  const [encounterName, setEncounterName] = useState(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(actions.resetEncounterOperation());
    // if (editMode) {
    //   dispatch(actions.getParticipantTemplateById(templateId));
    // }

    // return () => {
    //   if (editMode) {
    //     dispatch(actions.resetEditedParticipantTemplate());
    //   }
    // };
  }, [dispatch]);

  const handleSaveEncounter = useCallback(() => {
    setSubmitAttempted(true);
    dispatch(actions.editEncounter(null, { name: encounterName }));
  }, [dispatch, encounterName]);

  let view;
  if (submitAttempted && props.success) {
    view = <Redirect to="/encounters" />;
  } else {
    view = (
      <div>
        <div>Create encounter</div>
        <input
          className={classes.EncounterName}
          onChange={event => setEncounterName(event.target.value)}
        />
        {props.error ? (
          <div>
            <ServerValidationError serverError={props.error} for="name" />
          </div>
        ) : (
          ''
        )}
        <ItemsRow centered>
          <Button type="button" onClick={history.goBack}>
            Cancel
          </Button>
          <Button onClick={handleSaveEncounter}>Save</Button>
        </ItemsRow>
        {props.error ? (
          <div>
            <ServerError serverError={props.error} />
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
  return view;
};

EditEncounter.propTypes = {};

const mapStateToProps = state => {
  return {
    error: state.encounter.error,
    success: state.encounter.operationSuccess
  };
};

export default connect(mapStateToProps)(withAuthCheck(EditEncounter));
