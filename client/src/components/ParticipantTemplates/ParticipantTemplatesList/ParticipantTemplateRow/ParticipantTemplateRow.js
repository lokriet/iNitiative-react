import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { faCog, faTimes } from '@fortawesome/free-solid-svg-icons';

import List from '../../../UI/Table/List/List';
import IconButton from '../../../UI/Form/Button/IconButton/IconButton';
import ItemsRow from '../../../UI/ItemsRow/ItemsRow';

import classes from './ParticipantTemplateRow.module.css';
import Popup from 'reactjs-popup';
import Spinner from '../../../UI/Spinner/Spinner';
import Button from '../../../UI/Form/Button/Button';
import ServerError from '../../../UI/Errors/ServerError/ServerError';
import { connect } from 'react-redux';

const ParticipantTemplateRow = ({ template, onEdit, onDelete, onDeleteCancelled, serverError }) => {
  const [deleting, setDeleting] = useState(false);

  const handleConfirmDelete = useCallback(() => {
    setDeleting(true);
    onDelete(template);
  }, [template, onDelete]);

  const handleCancelDelete = useCallback(
    (close) => {
      onDeleteCancelled();
      close();
    },
    [onDeleteCancelled],
  )

  useEffect(() => {
    if (serverError) {
      setDeleting(false);
    }
  }, [serverError])
  
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
          {/* <IconButton icon={faTimes} onClick={() => onDelete(template._id)} /> */}
          <Popup
            trigger={open => <IconButton icon={faTimes} />}
            modal
            arrow={false}
            closeOnDocumentClick={false}
            closeOnEscape={false}
            contentStyle={{width: 'auto'}}
          >
            {close => (
              <>
                <div className={classes.ModalQuestion}>
                  Delete participant template ({template.name})?
                </div>
                <ServerError serverError={serverError} />
                <br />
                {deleting ? (
                  <Spinner />
                ) : (
                  <ItemsRow centered>
                    <Button onClick={handleConfirmDelete}>Delete!</Button>
                    <Button onClick={() => handleCancelDelete(close)}>NO!</Button>
                  </ItemsRow>
                )}
              </>
            )}
          </Popup>
        </ItemsRow>
      </td>
    </tr>
  );
};

ParticipantTemplateRow.propTypes = {
  template: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onDeleteCancelled: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    serverError: state.participantTemplate.error
  };
};

export default connect(mapStateToProps)(ParticipantTemplateRow);
