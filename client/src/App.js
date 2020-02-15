import React, { useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { useDispatch, connect } from 'react-redux';

import * as actions from './store/actions';
import Layout from './components/UI/Layout/Layout';
import { Toolbar } from './components/Navigation/Toolbar/Toolbar';
import Home from './components/Home/Home';
import PageNotFound from './components/PageNotFound/PageNotFound';
import Logout from './components/Auth/Logout/Logout';
import Spinner from './components/UI/Spinner/Spinner';
import Login from './components/Auth/Login/Login';
import Register from './components/Auth/Register/Register';
import MechanicsSetup from './components/MechanicsSetup/MechanicsSetup';
import ParticipantTemplates from './components/ParticipantTemplates/ParticipantTemplates';
import EditParticipantTemplate from './components/ParticipantTemplates/EditParticipantTemplate/EditParticipantTemplate';

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
          <Route path="/admin">
            <MechanicsSetup isHomebrew={false} />
          </Route>

          <Route path="/homebrew">
            <MechanicsSetup isHomebrew={true} />
          </Route>

          <Route path="/templates/new">
            <EditParticipantTemplate isNew />{' '}
          </Route>
          <Route path="/templates/edit/:templateId">
            <EditParticipantTemplate />{' '}
          </Route>
          <Route path="/templates" component={ParticipantTemplates} />
          <Route path="/logout" component={Logout} />
          <Route path="/" component={PageNotFound} />
        </Switch>
      </Layout>
    </BrowserRouter>
  ) : (
    <Spinner />
  );
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token != null,
    initialAuthCheckDone: state.auth.initialAuthCheckDone,
    isAdmin: state.auth.user != null && state.auth.user.isAdmin
  };
};

export default connect(mapStateToProps)(App);
