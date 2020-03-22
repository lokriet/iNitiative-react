import React from 'react';
import PropTypes from 'prop-types';
import ItemsRow from '../../../../../../UI/ItemsRow/ItemsRow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import classes from './ListItem.module.css';
import Popup from 'reactjs-popup';
import Color from '../../../../../../UI/Color/Color';
import { isEmpty } from '../../../../../../../util/helper-methods';

const ListItem = ({ item, onDelete, showColor }) => {
  let nameRow = showColor ? (
    <>
      {!isEmpty(item.color) ? <Color color={item.color} className={classes.Color} /> : null}
      <div className={classes.Name}>{item.name}</div>
    </>
  ) : (<div className={classes.Name}>{item.name}</div>);
  return (
    <ItemsRow key={item._id} alignCentered className={classes.ListItem}>
      {'description' in item ? (
        <Popup
          on="hover"
          mouseEnterDelay={500}
          trigger={open => <div>{nameRow}</div>}
          contentStyle={{ width: 'auto' }}
        >
          <div className={classes.Description}>{item.description}</div>
        </Popup>
      ) : nameRow}
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
