import React from 'react';
import PropTypes from 'prop-types';
import classes from './ItemsRow.module.css';

const ItemsRow = props => {
  const {centered, alignCentered, className, ...htmlProps} = props;

  const classList = [classes.ItemsRow];
  if (centered) {
    classList.push(classes.Centered);
  }
  if (alignCentered) {
    classList.push(classes.AlignCentered)
  }
  if (className) {
    classList.push(props.className);
  }

  return <div className={classList.join(' ')} {...htmlProps}>{props.children}</div>;
};

ItemsRow.propTypes = {
  centered: PropTypes.bool,
  alignCentered: PropTypes.bool,
  className: PropTypes.string
};

export default ItemsRow;
