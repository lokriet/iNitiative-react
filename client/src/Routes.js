import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './components/Home/Home';
import Register from './components/Auth/Register/Register';
import Login from './components/Auth/Login/Login';
import MechanicsSetup from './components/MechanicsSetup/MechanicsSetup';
import EditParticipantTemplate from './components/ParticipantTemplates/EditParticipantTemplate/EditParticipantTemplate';
import ParticipantTemplates from './components/ParticipantTemplates/ParticipantTemplates';
import EditEncounter from './components/Encounters/EditEncounter/EditEncounter';
import PlayEncounter from './components/Encounters/PlayEncounter/PlayEncounter';
import EncountersList from './components/Encounters/EncountersList/EncountersList';
import Discuss from './components/Discuss/Discuss';
import Logout from './components/Auth/Logout/Logout';
import PageNotFound from './components/PageNotFound/PageNotFound';
import PasswordResetRequest from './components/Auth/PasswordResetRequest/PasswordResetRequest';
import PasswordReset from './components/Auth/PasswordReset/PasswordReset';

const Routes = () => {
  return (
    <Switch>
      <Route path="/" exact component={Home} />

      <Route
        path="/admin"
        render={() => <MechanicsSetup isHomebrew={false} />}
      />

      <Route
        path="/homebrew"
        render={() => <MechanicsSetup isHomebrew={true} />}
      />

      <Route
        path="/templates/new"
        render={() => <EditParticipantTemplate isNew />}
      />
      <Route
        path="/templates/edit/:templateId"
        component={EditParticipantTemplate}
      />
      <Route path="/templates" component={ParticipantTemplates} />

      <Route
        path="/encounters/new"
        render={(routeProps) => <EditEncounter isNew {...routeProps} />}
      />

      <Route path="/encounters/edit/:encounterId" component={EditEncounter} />
      <Route path="/encounters/play/:encounterId" component={PlayEncounter} />
      <Route path="/encounters" exact component={EncountersList} />
      <Route path="/discuss" component={Discuss} />
      <Route path="/logout" component={Logout} />

      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/requestPasswordReset" component={PasswordResetRequest} />
      <Route
        path="/resetPassword/:resetPasswordToken"
        component={PasswordReset}
      />

      <Route path="/404" component={PageNotFound} />
      <Route path="/" component={PageNotFound} />
    </Switch>
  );
};

export default Routes;
