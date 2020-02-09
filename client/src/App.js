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
import PageNotFound from './components/PageNotFound/PageNotFound';
import { Spinner } from './components/UI/Spinner/Spinner';

const App = props => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!props.isAuthenticated && !props.initialAuthCheckDone) {  
      dispatch(actions.authCheckInitialState());
    }
  }, [props.isAuthenticated, props.initialAuthCheckDone, dispatch]);

  return props.initialAuthCheckDone ? (
    <BrowserRouter>
      <Layout>
        <Toolbar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          {props.isAdmin ? <Route path="/admin" component={Admin} /> : null}
          <Route path="/logout" component={Logout} />
          <Route path="/" component={PageNotFound} />
        </Switch>
      </Layout>
    </BrowserRouter>
    ) : <Spinner />;
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token != null,
    initialAuthCheckDone: state.auth.initialAuthCheckDone,
    isAdmin: state.auth.user != null && state.auth.user.isAdmin
  };
};

export default connect(mapStateToProps)(App);
