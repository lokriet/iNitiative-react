import React from 'react'
import PropTypes from 'prop-types'
import classes from './TabbedNavigation.module.css'

const TabbedNavigation = props => {
  return (
    <ul className={classes.TabbedNavigation}>
      {props.children}
    </ul>
  )
}

TabbedNavigation.propTypes = {

}

export default TabbedNavigation
