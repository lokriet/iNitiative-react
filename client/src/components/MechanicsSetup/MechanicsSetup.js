import React, { Fragment } from 'react';
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';
import TabbedNavigation from '../Navigation/TabbedNavigation/TabbedNavigation';
import TabbedNavigationItem from '../Navigation/TabbedNavigation/TabbedNavigationItem/TabbedNavigationItem';
import DamageTypes from './DamageTypes/DamageTypes';
import Conditions from './Conditions/Conditions';
import Features from './Features/Features';
import withAuthCheck from '../../hoc/withAuthCheck';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectIsAdmin } from '../Auth/authSlice';

const MechanicsSetup = ({isHomebrew}) => {
  let { path, url } = useRouteMatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);

  let view = null;
  if (!isAuthenticated) {
    view = null;
  } else if (!isHomebrew && isAuthenticated && !isAdmin) {
    view = <Redirect to="/" />;
  } else {
    view = (
      <Fragment>
        <TabbedNavigation>
          <TabbedNavigationItem link={`${url}/damage-types`}>
            Damage Types
          </TabbedNavigationItem>
          <TabbedNavigationItem link={`${url}/conditions`}>
            Conditions
          </TabbedNavigationItem>
          <TabbedNavigationItem link={`${url}/features`}>
            Features
          </TabbedNavigationItem>
        </TabbedNavigation>

        <Switch>
          <Route exact path={path}>
            <Redirect to={`${url}/damage-types`} />
          </Route>
          <Route path={`${path}/damage-types`}>
            <DamageTypes isHomebrew={isHomebrew} />
          </Route>
          <Route path={`${path}/conditions`}>
            <Conditions isHomebrew={isHomebrew} />
          </Route>
          <Route path={`${path}/features`}>
            <Features isHomebrew={isHomebrew} />
          </Route>
          <Route path="*">
            <Redirect to="/404" />
          </Route>
        </Switch>
      </Fragment>
    );
  }
  return view;
};

export default withAuthCheck(MechanicsSetup);
