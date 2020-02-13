import React from 'react';
import PropTypes from 'prop-types';
import classes from './ItemsRow.module.css';

const ItemsRow = props => {
  const classList = [classes.ItemsRow];
  if (props.centered) {
    classList.push(classes.Centered);
  }

  return <div className={classList.join(' ')}>{props.children}</div>;
};

ItemsRow.propTypes = {
  centered: PropTypes.bool
};

export default ItemsRow;
