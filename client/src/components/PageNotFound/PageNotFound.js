import React from 'react'
import classes from './PageNotFound.module.css'
import goat from '../../assets/images/goat.jpg';

const PageNotFound = () => {
  return (
    <div className={classes.Container}>
      <p>I don't know what you're talking about.</p>
      <br />
      <p>But I have this!</p>
      <br />
      <img src={goat} alt="cute" />
    </div>
  )
}

export default PageNotFound
