import { useEffect } from 'react';
import { logout } from '../authSlice';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';


const Logout = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(logout());
    history.push('/');
  })

  return null;
};

export default Logout;
