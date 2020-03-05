import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';
import TabbedNavigation from '../Navigation/TabbedNavigation/TabbedNavigation';
import TabbedNavigationItem from '../Navigation/TabbedNavigation/TabbedNavigationItem/TabbedNavigationItem';
import DamageTypes from './DamageTypes/DamageTypes';
import Conditions from './Conditions/Conditions';
import Features from './Features/Features';
import withAuthCheck from '../../hoc/withAuthCheck';

const MechanicsSetup = props => {
  let { path, url } = useRouteMatch();

        let view = null;
        if (!props.isAuthenticated) {
          view = null;
        } else if (!props.isHomebrew && props.isAuthenticated && !props.isAdmin) {
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
                  <DamageTypes isHomebrew={props.isHomebrew} />
                </Route>
                <Route path={`${path}/conditions`}>
                  <Conditions isHomebrew={props.isHomebrew} />
                </Route>
                <Route path={`${path}/features`}>
                  <Features isHomebrew={props.isHomebrew} />
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

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.user != null,
    isAdmin: state.auth.user && state.auth.user.isAdmin
  };
};

export default connect(mapStateToProps)(withAuthCheck(MechanicsSetup));
