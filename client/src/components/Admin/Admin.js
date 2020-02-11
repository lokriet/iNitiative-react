import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {useRouteMatch, Switch, Route, Redirect} from 'react-router-dom';
import useAuthCheck from '../../hooks/useAuthCheck';
import TabbedNavigation from '../Navigation/TabbedNavigation/TabbedNavigation';
import TabbedNavigationItem from '../Navigation/TabbedNavigation/TabbedNavigationItem/TabbedNavigationItem';
import DamageTypes from '../Setup/DamageTypes/DamageTypes';

const Admin = props => {
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
          <DamageTypes />
        </Route>
        <Route path={`${path}/conditions`}>
          <div>I'll be conditions admin</div>
        </Route>
        <Route path={`${path}/features`}>
          <div>I'll be features admin</div>
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

Admin.propTypes = {};


export default connect(mapStateToProps)(Admin);
