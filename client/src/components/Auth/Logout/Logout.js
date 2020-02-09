import React from 'react';
import * as actions from '../../../store/actions/index';
import { Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const Logout = () => {
  const dispatch = useDispatch();
  dispatch(actions.logout());
  
  return (
    <Redirect to="/" />
  )
};

export default Logout;
