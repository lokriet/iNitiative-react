import React from 'react';
import PropTypes from 'prop-types';
import classes from './ItemsRow.module.css';

const ItemsRow = props => {
  const classList = [classes.ItemsRow];
  if (props.centered) {
    classList.push(classes.Centered);
  }
  if (props.alignCentered) {
    classList.push(classes.AlignCentered)
  }

  return <div className={classList.join(' ')}>{props.children}</div>;
};

ItemsRow.propTypes = {
  centered: PropTypes.bool,
  alignCentered: PropTypes.bool
};

export default ItemsRow;
