import React, { useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Layout from './components/UI/Layout/Layout';
import Home from './components/Home/Home';
import { Toolbar } from './components/Navigation/Toolbar/Toolbar';
import Register from './components/Auth/Register/Register';
import Login from './components/Auth/Login/Login';
import { useDispatch, connect } from 'react-redux';
import * as actions from './store/actions';
import Admin from './components/Admin/Admin';
import Logout from './components/Auth/Logout/Logout';

const App = props => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!props.isAuthenticated && !props.initialAuthCheckDone) {  
      dispatch(actions.authCheckInitialState());
    }
  }, [props.isAuthenticated, props.initialAuthCheckDone, dispatch]);

  return (
    <BrowserRouter>
      <Layout>
        <Toolbar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/admin" component={Admin} />
          <Route path="/logout" component={Logout} />
        </Switch>
      </Layout>
    </BrowserRouter>
  );
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token != null,
    initialAuthCheckDone: state.auth.initialAuthCheckDone
  };
};

export default connect(mapStateToProps)(App);
