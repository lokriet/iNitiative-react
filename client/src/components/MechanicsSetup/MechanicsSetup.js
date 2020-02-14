import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import {useRouteMatch, Switch, Route, Redirect} from 'react-router-dom';
import useAuthCheck from '../../hooks/useAuthCheck';
import TabbedNavigation from '../Navigation/TabbedNavigation/TabbedNavigation';
import TabbedNavigationItem from '../Navigation/TabbedNavigation/TabbedNavigationItem/TabbedNavigationItem';
import DamageTypes from './DamageTypes/DamageTypes';
import Conditions from './Conditions/Conditions';
import Features from './Features/Features';

const MechanicsSetup = props => {
  useAuthCheck(props);
  let { path, url } = useRouteMatch();

  return props.isAuthenticated ? (
    <Fragment>
      <TabbedNavigation>
        <TabbedNavigationItem link={`${url}/damage-types`}>Damage Types</TabbedNavigationItem>
        <TabbedNavigationItem link={`${url}/conditions`}>Conditions</TabbedNavigationItem>
        <TabbedNavigationItem link={`${url}/features`}>Features</TabbedNavigationItem>
      </TabbedNavigation>

      <Switch>
        <Route exact path={path}>
          <Redirect to={`${url}/damage-types`} />
        </Route>
        <Route path={`${path}/damage-types`}>
          <DamageTypes isHomebrew={props.isHomebrew} />
        </Route>
        <Route path={`${path}/conditions`}>
          <Conditions isHomebrew={props.isHomebrew} />
        </Route>
        <Route path={`${path}/features`}>
          <Features isHomebrew={props.isHomebrew} />
        </Route>
      </Switch>
    </Fragment>
  ) : null;
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token != null
  };
};

export default connect(mapStateToProps)(MechanicsSetup);
