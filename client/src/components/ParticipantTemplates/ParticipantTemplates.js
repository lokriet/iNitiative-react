import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';

import withAuthCheck from '../../hoc/withAuthCheck';

import TabbedNavigation from '../Navigation/TabbedNavigation/TabbedNavigation';
import TabbedNavigationItem from '../Navigation/TabbedNavigation/TabbedNavigationItem/TabbedNavigationItem';
import ParticipantTemplatesList from './ParticipantTemplatesList/ParticipantTemplatesList';

export const ParticipantType = {
  Player: 'player',
  Monster: 'monster'
};

const ParticipantTemplates = props => {
  let { path, url } = useRouteMatch();

  return props.isAuthenticated ? (
    <Fragment>
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
    </Fragment>
  ) : null;
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token != null,
    initialAuthCheckDone: state.auth.initialAuthCheckDone
  };
};

export default connect(mapStateToProps)(withAuthCheck(ParticipantTemplates));
