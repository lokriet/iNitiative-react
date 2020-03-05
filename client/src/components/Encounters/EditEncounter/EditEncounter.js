import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import * as actions from '../../../store/actions';
import withAuthCheck from '../../../hoc/withAuthCheck';

import Button from '../../UI/Form/Button/Button';
import ServerError from '../../UI/Errors/ServerError/ServerError';
import ServerValidationError from '../../UI/Errors/ServerValidationError/ServerValidationError';

import classes from './EditEncounter.module.css';
import { useDispatch, connect } from 'react-redux';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import ItemsRow from '../../UI/ItemsRow/ItemsRow';
import Spinner from '../../UI/Spinner/Spinner';
import TemplatesPicker from '../TemplatesPicker/TemplatesPicker';

const EditEncounter = props => {
  const [encounterName, setEncounterName] = useState('');
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const { encounterId } = useParams();
  const editMode = !props.isNew;

  useEffect(() => {
    dispatch(actions.resetEncounterOperation());
    dispatch(actions.getParticipantTemplates());

    if (editMode) {
      dispatch(actions.getEncounterById(encounterId));
    }

    return () => {
      if (editMode) {
        dispatch(actions.resetEditedEncounter());
      }
    };
  }, [dispatch, editMode, encounterId]);

  useEffect(() => {
    if (props.editedEncounter) {
      setEncounterName(props.editedEncounter.name);
    }
  }, [props.editedEncounter]);

  const handleSaveEncounter = useCallback(() => {
    setSubmitAttempted(true);
    if (editMode) {
      dispatch(
        actions.editEncounter(encounterId, {
          _id: encounterId,
          name: encounterName
        })
      );
    } else {
      dispatch(actions.editEncounter(null, { name: encounterName }));
    }
  }, [dispatch, encounterName, editMode, encounterId]);

  let view;
  if (submitAttempted && props.saveSuccess) {
    view = <Redirect to="/encounters" />;
  } else if (editMode && props.fetchingEncounterError) {
    view = <ServerError serverError={props.fetchingEncounterError} />;
  } else if (editMode && !props.editedEncounter) {
    view = <Spinner />;
  } else {
    view = (
      <div>
        <div>Create encounter</div>
        <input
          className={classes.EncounterName}
          value={encounterName}
          onChange={event => setEncounterName(event.target.value)}
        />
        
        <div className={classes.TemplatesPicker}>
          <TemplatesPicker />
        </div>

        {props.saveError ? (
          <div>
            <ServerValidationError serverError={props.saveError} for="name" />
            <ServerError serverError={props.saveError} />
          </div>
        ) : null}
        <ItemsRow centered>
          <Button type="button" onClick={history.goBack}>
            Cancel
          </Button>
          <Button onClick={handleSaveEncounter}>Save</Button>
        </ItemsRow>
      </div>
    );
  }
  return view;
};

EditEncounter.propTypes = {};

const mapStateToProps = state => {
  return {
    saveError: state.encounter.operationError,
    saveSuccess: state.encounter.operationSuccess,
    editedEncounter: state.encounter.editedEncounter,
    fetchingEncounterError: state.encounter.fetchingError
  };
};

export default connect(mapStateToProps)(withAuthCheck(EditEncounter));
