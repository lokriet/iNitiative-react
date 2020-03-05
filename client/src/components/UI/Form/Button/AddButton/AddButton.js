import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import classes from './AddButton.module.css';

const AddButton = props => {
  return (
    <button
      type="button"
      className={classes.AddButton}
      {...props}
    >
      <FontAwesomeIcon icon={faPlus} className={classes.AddIcon} />
      Add new
    </button>
  );
};

export default AddButton;