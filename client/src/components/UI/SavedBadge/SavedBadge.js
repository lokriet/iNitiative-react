import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { CSSTransition } from 'react-transition-group';
import classes from './SavedBadge.module.css';

const SavedBadge = ({ show, onHide }) => {
  useEffect(() => {
    if (show) {
      setTimeout(() => {
        onHide();
      }, 2000);
    }
  }, [show, onHide]);

  return (
    <CSSTransition
      timeout={500}
      in={show}
      unmountOnExit
      classNames={{
        enter: classes.SavedBadgeEnter,
        enterActive: classes.SavedBadgeEnterActive,
        exit: classes.SavedBadgeExit,
        exitActive: classes.SavedBadgeExitActive
      }}
    >
      <span className={classes.SavedBadge}>Saved</span>
    </CSSTransition>
  );
};

SavedBadge.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired
};

export default SavedBadge;
