import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import {fetchTemplates, selectParticipantTemplatesByType} from '../../../ParticipantTemplates/participantTemplatesSlice';

import { ParticipantType } from '../../../ParticipantTemplates/ParticipantTemplates';
import ItemsRow from '../../../UI/ItemsRow/ItemsRow';
import TemplatesPickList from './TemplatesPickList/TemplatesPickList';
import Spinner from '../../../UI/Spinner/Spinner';
import ServerError from '../../../UI/Errors/ServerError/ServerError';

import classes from './TemplatesPicker.module.css';

const TemplatesPicker = ({onAdd}) => {
  const [templatesType, setTemplatesType] = useState(ParticipantType.Player);
  const monsters = useSelector(selectParticipantTemplatesByType(ParticipantType.Monster));
  const players = useState(selectParticipantTemplatesByType(ParticipantType.Player));
  const {fetching, error: fetchingError} = useSelector(state => state.participantTemplate);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  let templatesList;
  if (fetchingError) {
    templatesList = <ServerError serverError={fetchingError} />;
  } else if (fetching) {
    templatesList = <Spinner />;
  } else {
    templatesList = (
      <TemplatesPickList
        templates={
          templatesType === ParticipantType.Player
            ? players
            : monsters
        }
        onAdd={onAdd}
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

export default TemplatesPicker;
