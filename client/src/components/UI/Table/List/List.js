import React from 'react';
import PropTypes from 'prop-types';
import classes from './List.module.css';

const List = props => {
  return (
    <div className={classes.List}>
      {props.items.map(item => {
        return (
          <div
            key={item[props.listedProperty || 'name']}
            className={classes.ListItem}
          >
            {item[props.listedProperty || 'name']}
          </div>
        );
      })}
    </div>
  );
};

List.propTypes = {
  items: PropTypes.array,
  listedProperty: PropTypes.string
};

export default List;
