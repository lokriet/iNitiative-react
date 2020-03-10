import React, { useState, useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actions from '../../../../store/actions';

import { ParticipantType } from '../../../ParticipantTemplates/ParticipantTemplates';
import ItemsRow from '../../../UI/ItemsRow/ItemsRow';
import TemplatesPickList from './TemplatesPickList/TemplatesPickList';
import Spinner from '../../../UI/Spinner/Spinner';
import ServerError from '../../../UI/Errors/ServerError/ServerError';

import classes from './TemplatesPicker.module.css';

const TemplatesPicker = props => {
  const [templatesType, setTemplatesType] = useState(ParticipantType.Player);
  const [templates, setTemplates] = useState({ initialized: false });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.getParticipantTemplates());
  }, [dispatch]);

  useEffect(() => {
    if (props.allTemplates && !props.fetching && !props.fetchingError) {
      const players = [];
      const monsters = [];

      props.allTemplates.forEach(template => {
        if (template.type === ParticipantType.Player) {
          players.push(template);
        } else {
          monsters.push(template);
        }
      });

      setTemplates({
        initialized: true,
        players,
        monsters
      });
    }
  }, [props.allTemplates, props.fetchingError, props.fetching]);

  let templatesList;
  if (props.fetchingError) {
    templatesList = <ServerError serverError={props.fetchingError} />;
  } else if (props.fetching) {
    templatesList = <Spinner />;
  } else {
    templatesList = (
      <TemplatesPickList
        templates={
          templatesType === ParticipantType.Player
            ? templates.players
            : templates.monsters
        }
        onAdd={props.onAdd}
      />
    );
  }

  return (
    <div className={classes.Container}>
      <ItemsRow className={classes.Tabs} centered>
        <button
          className={`${classes.TabButton} ${templatesType === ParticipantType.Player ? classes.Active : ''}`}
          onClick={() => setTemplatesType(ParticipantType.Player)}
        >
          Players
        </button>
        <button
          className={`${classes.TabButton} ${templatesType === ParticipantType.Monster ? classes.Active : ''}`}
          onClick={() => setTemplatesType(ParticipantType.Monster)}
        >
          Monsters
        </button>
      </ItemsRow>
      <div className={classes.TemplatesList}>{templatesList}</div>
    </div>
  );
};

TemplatesPicker.propTypes = {
  onAdd: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    allTemplates: state.participantTemplate.participantTemplates,
    fetching: state.participantTemplate.fetching,
    fetchingError: state.participantTemplate.error
  };
};

export default connect(mapStateToProps)(TemplatesPicker);
