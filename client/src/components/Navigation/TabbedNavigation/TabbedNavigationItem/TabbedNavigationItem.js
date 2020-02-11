import React from 'react'
import { NavLink } from 'react-router-dom'
import classes from './TabbedNavigationItem.module.css'

const TabbedNavigationItem = props => {
  return (
    <li className={classes.TabbedNavigationItem}>
      <NavLink to={props.link} activeClassName={classes.active}>{props.children}</NavLink>
    </li>
  )
}

export default TabbedNavigationItem
