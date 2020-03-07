import React from 'react';
import PropTypes from 'prop-types';
import classes from './Color.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@fortawesome/free-solid-svg-icons';

const Color = React.forwardRef((props, ref) => {
  const {color, className, ...htmlProps} = props;

  const classList = [classes.Color];
  if (props.color == null) {
    classList.push(classes.NoColor);
  }
  if (className != null) {
    classList.push(className);
  }
  return props.color == null ? (
    <div className={classList.join(' ')} ref={ref} {...htmlProps}>
      <FontAwesomeIcon icon={faBan} className={classes.NoColorIcon} />
    </div>
  ) : (
    <div
      ref={ref}
      {...htmlProps}
      style={{ backgroundColor: props.color }}
      className={classList.join(' ')}
    ></div>
  );
});

Color.propTypes = {
  color: PropTypes.string
};

export default Color;
