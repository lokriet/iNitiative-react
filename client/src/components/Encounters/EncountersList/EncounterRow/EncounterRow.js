import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { faPlay, faCog, faTimes } from '@fortawesome/free-solid-svg-icons';

import ItemsRow from '../../../UI/ItemsRow/ItemsRow';
import IconButton from '../../../UI/Form/Button/IconButton/IconButton';
import Popup from 'reactjs-popup';
import Button from '../../../UI/Form/Button/Button';
import Spinner from '../../../UI/Spinner/Spinner';

import classes from './EncounterRow.module.css';
import ServerError from '../../../UI/Errors/ServerError/ServerError';

const formatDate = date => {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

const EncounterRow = ({ encounter, serverError, onDelete, onDeleteCancelled, onEdit, onPlay }) => {
  const [deleting, setDeleting] = useState(false);

  const handleConfirmDelete = useCallback(() => {
    console.log('deleting', encounter._id);
    setDeleting(true);
    onDelete(encounter._id);
  }, [encounter._id, onDelete]);

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
    <tr className={classes.EncounterRow}>
      <td>{encounter.name}</td>
      <td>{formatDate(encounter.createdAt)}</td>
      <td>{formatDate(encounter.updatedAt)}</td>
      <td>
        <ItemsRow>
          <IconButton icon={faPlay} onClick={onPlay} />
          <IconButton icon={faCog} onClick={onEdit} />

          <Popup
            trigger={open => <IconButton icon={faTimes} />}
            position="right center"
            modal
            offsetX={20}
            arrow={false}
            closeOnDocumentClick={false}
            closeOnEscape={false}
          >
            {close => (
              <>
                <div className={classes.ModalQuestion}>
                  Delete encounter {encounter.name}?
                </div>
                <ServerError serverError={serverError} />
                {deleting ? (
                  <Spinner />
                ) : (
                  <ItemsRow centered>
                    <Button onClick={() => handleCancelDelete(close)}>Cancel</Button>
                    <Button onClick={handleConfirmDelete}>Delete!</Button>
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

EncounterRow.propTypes = {
  encounter: PropTypes.object.isRequired,
  onPlay: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onDeleteCancelled: PropTypes.func.isRequired,
  serverError: PropTypes.object
};

export default EncounterRow;
