import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { faPlay, faCog, faTimes } from '@fortawesome/free-solid-svg-icons';

import { formatDate } from '../../../../util/helper-methods';

import ItemsRow from '../../../UI/ItemsRow/ItemsRow';
import IconButton from '../../../UI/Form/Button/IconButton/IconButton';
import Popup from 'reactjs-popup';
import Button from '../../../UI/Form/Button/Button';
import Spinner from '../../../UI/Spinner/Spinner';

import classes from './EncounterRow.module.css';
import ServerError from '../../../UI/Errors/ServerError/ServerError';

const EncounterRow = ({
  encounter,
  serverError,
  onDelete,
  onDeleteCancelled,
  onEdit,
  onPlay
}) => {
  const [deleting, setDeleting] = useState(false);

  const handleConfirmDelete = useCallback(() => {
    setDeleting(true);
    onDelete(encounter._id);
  }, [encounter._id, onDelete]);

  const handleCancelDelete = useCallback(
    (close) => {
      onDeleteCancelled();
      close();
    },
    [onDeleteCancelled]
  );

  useEffect(() => {
    if (serverError) {
      setDeleting(false);
    }
  }, [serverError]);

  return (
    <tr className={classes.EncounterRow}>
      <td className={classes.Name}>{encounter.name}</td>
      <td className={classes.Date}>{formatDate(encounter.createdAt)}</td>
      <td className={classes.Date}>{formatDate(encounter.updatedAt)}</td>
      <td className={classes.Buttons}>
        <ItemsRow>
          <IconButton icon={faPlay} onClick={() => onPlay(encounter._id)} />
          <IconButton icon={faCog} onClick={() => onEdit(encounter._id)} />

          <Popup
            trigger={(open) => <IconButton icon={faTimes} />}
            modal
            arrow={false}
            closeOnDocumentClick={false}
            closeOnEscape={false}
            contentStyle={{ width: 'auto' }}
          >
            {(close) => (
              <>
                <div className={classes.ModalQuestion}>
                  Delete encounter {encounter.name}?
                </div>
                <ServerError serverError={serverError} />
                {deleting ? (
                  <Spinner />
                ) : (
                  <ItemsRow centered>
                    <Button onClick={handleConfirmDelete}>Delete!</Button>
                    <Button onClick={() => handleCancelDelete(close)}>
                      NO!
                    </Button>
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
