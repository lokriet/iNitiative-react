import React from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';

import withAuthCheck from '../../hoc/withAuthCheck';

import TabbedNavigation from '../Navigation/TabbedNavigation/TabbedNavigation';
import TabbedNavigationItem from '../Navigation/TabbedNavigation/TabbedNavigationItem/TabbedNavigationItem';
import ParticipantTemplatesList from './ParticipantTemplatesList/ParticipantTemplatesList';
import { ParticipantType } from './store/participantTemplateModel';

const ParticipantTemplates = () => {
  const { path, url } = useRouteMatch();

  const isAuthenticated = useSelector(state => state.auth.token != null);

  return isAuthenticated ? (
    <>
      <TabbedNavigation>
        <TabbedNavigationItem link={`${url}/players`}>
          Players
        </TabbedNavigationItem>
        <TabbedNavigationItem link={`${url}/monsters`}>
          Monsters
        </TabbedNavigationItem>
      </TabbedNavigation>

      <Switch>
        <Route exact path={path}>
          <Redirect to={`${url}/players`} />
        </Route>
        <Route path={`${path}/players`}>
          <ParticipantTemplatesList type={ParticipantType.Player} />
        </Route>
        <Route path={`${path}/monsters`}>
          <ParticipantTemplatesList type={ParticipantType.Monster} />
        </Route>
        <Route path="*">
          <Redirect to='/404' />
        </Route>
      </Switch>
    </>
  ) : null;
};

export default withAuthCheck(ParticipantTemplates);
