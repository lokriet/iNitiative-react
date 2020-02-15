import React from 'react';
import PropTypes from 'prop-types';
import classes from './GroupButton.module.css';

const GroupButton = props => {
  const buttonClickedHandler = event => {
    event.preventDefault();
    props.onGroupSelectionSwitched(props.name);
  };

  const checkboxClickedHandler = event => {
    props.onGroupSelectionSwitched(props.name);
  };

  return (
    <div className={classes.GroupButton}>
      <input
        type="checkbox"
        id={props.name}
        checked={props.selected}
        onChange={checkboxClickedHandler}
      />
      <button
        type="button"
        className={classes.LabelButton}
        onClick={buttonClickedHandler}
      >
        <label htmlFor={props.name}>{props.name === "" ? "No name" : props.name}</label>
      </button>
    </div>
  );
};

GroupButton.propTypes = {
  name: PropTypes.string,
  selected: PropTypes.bool,
  onGroupSelectionSwitched: PropTypes.func
};

export default GroupButton;
