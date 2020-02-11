import React from 'react'
import classes from './TabbedNavigation.module.css'

const TabbedNavigation = props => {
  return (
    <ul className={classes.TabbedNavigation}>
      {props.children}
    </ul>
  )
}

export default TabbedNavigation
