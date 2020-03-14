import React from 'react';
import PropTypes from 'prop-types';
import ItemsRow from '../../../../../../UI/ItemsRow/ItemsRow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import classes from './ListItem.module.css';
import Popup from 'reactjs-popup';

const ListItem = ({ item, onDelete }) => {
  return (
    <ItemsRow key={item._id} alignCentered className={classes.ListItem}>
      {'description' in item ? (
        <Popup
          on="hover"
          mouseEnterDelay={500}
          trigger={open => <div className={classes.Name}>{item.name}</div>}
          contentStyle={{width: 'auto'}}
        >
          <div className={classes.Description}>{item.description}</div>
        </Popup>
      ) : (
        <div className={classes.Name}>{item.name}</div>
      )}
      <button
        onClick={() => onDelete(item)}
        className={`${classes.HidingButton} ${classes.DeleteButton}`}
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </ItemsRow>
  );
};

ListItem.propTypes = {
  item: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default ListItem;
