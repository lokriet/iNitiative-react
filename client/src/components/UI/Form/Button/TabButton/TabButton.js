import React from 'react'
import PropTypes from 'prop-types'
import classes from './TabButton.module.css'

const TabButton = props => {
  const { className, isActive, ...htmlProps } = props;
  
  return (
    <button type='button' className={`${classes.TabButton} ${isActive ? classes.Active : ''} ${className}`} {...htmlProps} >
      {props.children}
    </button>
  );
}

TabButton.propTypes = {
  isActive: PropTypes.bool,
  className: PropTypes.string
}

export default TabButton
